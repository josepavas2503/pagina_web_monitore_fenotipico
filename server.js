const express = require('express');
const path = require('path');
const apiRoutes = require('./src/routes/api');

const app = express();

const PORT = process.env.PORT || 3000;

// Servir la carpeta public (Vistas)
app.use(express.static(path.join(__dirname, 'public')));

// Enlazar las rutas API (Controladores)
app.use('/api', apiRoutes);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});