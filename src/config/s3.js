const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'auto',
    endpoint: process.env.AWS_ENDPOINT, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    // ESTA LÍNEA ES OBLIGATORIA PARA QUE LA FIRMA COINCIDA EN PROVEEDORES PERSONALIZADOS
    forcePathStyle: true 
});

module.exports = s3;