const express = require('express');
const router = express.Router(); // Utiliza express.Router() en lugar de express.Routes()

// Define tus rutas aquí
router.get('/', (req, res) => {
    // Lógica de la ruta
    res.send('¡Hola desde la ruta principal!');
});

// Exporta el enrutador
module.exports = router;