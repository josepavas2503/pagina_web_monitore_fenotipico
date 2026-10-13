const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3Controller');

// Ruta dinámica para leer cualquier subcarpeta de S3
router.get('/s3/:folder', s3Controller.getImagesByFolder);

module.exports = router;