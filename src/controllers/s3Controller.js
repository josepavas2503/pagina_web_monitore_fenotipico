const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../config/s3');

exports.getImagesByFolder = async (req, res) => {
    // Lee la carpeta desde la URL (ej: /api/s3/imagenes o /api/s3/segmentacion)
    const folder = req.params.folder; 
    const prefix = `${folder}/`;

    try {
        const command = new ListObjectsV2Command({
            Bucket: process.env.BUCKET_NAME,
            Prefix: prefix
        });
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
            return res.json([]);
        }

        // Filtrar objetos reales de imagen
        const archivosImagen = data.Contents.filter(item => 
            item.Key !== prefix && /\.(jpg|jpeg|png|webp)$/i.test(item.Key)
        );

        const imagenes = await Promise.all(
            archivosImagen.map(async (item) => {
                const getObjectCmd = new GetObjectCommand({
                    Bucket: process.env.BUCKET_NAME,
                    Key: item.Key
                });
                const signedUrl = await getSignedUrl(s3, getObjectCmd, { expiresIn: 3600 });

                return {
                    nombre: item.Key.replace(new RegExp(`^${prefix}`), ''),
                    url: signedUrl
                };
            })
        );

        res.json(imagenes);
    } catch (err) {
        console.error(`Error en S3 (${prefix}):`, err);
        res.status(500).json({ error: "Error al obtener imágenes", detalles: err.message });
    }
};