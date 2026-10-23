const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'auto',
    // Si la variable de entorno falla, usa tu URL personalizada directamente
    endpoint: process.env.AWS_ENDPOINT || 'https://t3.storageapi.dev', 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    forcePathStyle: true 
});

module.exports = s3;