require('dotenv').config();
console.log('Variables de entorno cargadas:', process.env);

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log("MONGO_URI después de forzar carga:", process.env.MONGODB_URI);


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const eventRoutes = require('./routes/events');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verificar si la variable está cargando correctamente
console.log("MONGO_URI:", process.env.MONGODB_URI);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión:', err));

// Rutas
app.use('/events', eventRoutes);

// Manejo global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log( 'Servidor corriendo en el puerto ${PORT}'));

module.exports = app;