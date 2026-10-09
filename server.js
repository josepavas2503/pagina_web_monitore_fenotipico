const express = require('express');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del cliente S3
const s3 = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined, // Necesario si usas MinIO o S3 compatible
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Endpoint para listar las imágenes del Bucket S3
app.get('/api/imagenes', async (req, res) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME
        });
        const data = await s3.send(command);

        const publicBaseUrl = process.env.S3_PUBLIC_URL || `https://${process.env.BUCKET_NAME}.s3.amazonaws.com`;

        const imagenes = (data.Contents || []).map(item => ({
            nombre: item.Key,
            url: `${publicBaseUrl}/${item.Key}`
        }));

        res.json(imagenes);
    } catch (err) {
        console.error("Error consultando S3:", err);
        res.status(500).json({ error: "Error al obtener imágenes del bucket", detalles: err.message });
    }
});
