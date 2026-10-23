const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'auto',
    endpoint: 'https://t3.storageapi.dev',
    credentials: {
        accessKeyId: 'tid_qZWqiYKkvoRhUhibdhCuUZguyrZZWwLRNyoxCFkairMAAHgXHG',
        secretAccessKey: 'tsec_0KtyMfpVGS6p-Eu1huj2CoC4DFBRwz_3MqjqGQ334giOw+F4FrU-B-Azrxu7oUPAYYOsLh'
    },
    forcePathStyle: true 
});

module.exports = s3;