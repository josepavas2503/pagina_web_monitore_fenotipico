const express = require('express');
const router = express.Router();
const s3Controller = require('../controllers/s3Controller');

// Línea 6: Asigna la función getFilesByFolder que debe estar exportada en s3Controller
router.get('/s3/:folder', s3Controller.getFilesByFolder);

module.exports = router;