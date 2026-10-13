const express = require('express');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de S3 con soporte obligatorio para Railway (storageapi.dev)
const s3 = new S3Client({
    region: process.env.AWS_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || 'https://t3.storageapi.dev',
    forcePathStyle: true, // INDISPENSABLE para storageapi.dev
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Endpoint para listar las imágenes dentro de la carpeta 'imagenes/'
app.get('/api/imagenes', async (req, res) => {
    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME,
            Prefix: 'imagenes/' // <--- Filtra únicamente los archivos dentro de esta carpeta
        });
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
            console.log("No se encontraron objetos en la carpeta imagenes/.");
            return res.json([]);
        }

        // 1. Descartar el marcador de carpeta y filtrar solo archivos con extensiones de imagen
        const archivosImagen = data.Contents.filter(item => 
            item.Key !== 'imagenes/' && /\.(jpg|jpeg|png|webp)$/i.test(item.Key)
        );

        // 2. Generar Presigned URLs para cada imagen encontrada
        const imagenes = await Promise.all(
            archivosImagen.map(async (item) => {
                const getObjectCmd = new GetObjectCommand({
                    Bucket: process.env.BUCKET_NAME,
                    Key: item.Key // Requiere la ruta completa (ej. "imagenes/foto.jpg")
                });
                
                const signedUrl = await getSignedUrl(s3, getObjectCmd, { expiresIn: 3600 });

                return {
                    nombre: item.Key.replace(/^imagenes\//, ''), // Limpia "imagenes/" para mostrar solo "foto.jpg"
                    key_completa: item.Key,
                    url: signedUrl
                };
            })
        );

        res.json(imagenes);
    } catch (err) {
        console.error("Error consultando la carpeta imagenes/ en S3:", err);
        res.status(500).json({ error: "Error al obtener imágenes del bucket", detalles: err.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});