const { ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3 = require('../config/s3');

// Forzamos el nombre exacto de tu bucket
const MI_BUCKET = 'organized-pierogi-qdsacep';

exports.getFilesByFolder = async (req, res) => {
    const folder = req.params.folder; 
    const prefix = `${folder}/`;

    try {
        const command = new ListObjectsV2Command({
            Bucket: MI_BUCKET,
            Prefix: prefix
        });
        const data = await s3.send(command);

        if (!data.Contents || data.Contents.length === 0) {
            return res.json([]); 
        }

        // Filtro para buscar solo imágenes
        const archivos = data.Contents.filter(item => 
            item.Key !== prefix && /\.(jpg|jpeg|png|gif)$/i.test(item.Key)
        );

        const documentos = await Promise.all(
            archivos.map(async (item) => {
                const getObjectCmd = new GetObjectCommand({
                    Bucket: MI_BUCKET,
                    Key: item.Key
                });
                const signedUrl = await getSignedUrl(s3, getObjectCmd, { expiresIn: 3600 });

                return {
                    nombre: item.Key.replace(new RegExp(`^${prefix}`), ''),
                    url: signedUrl
                };
            })
        );

        res.json(documentos);
    } catch (err) {
        console.error(`Error en S3 (${prefix}):`, err);
        res.status(500).json({ error: "Error al obtener imágenes", detalles: err.message });
    }
};