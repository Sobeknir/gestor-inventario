require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item'); // Importar el modelo de inventario

const path = require('path'); // Importar el módulo path
const reportes = require('./reportes'); // Importar el módulo de reportes
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir archivos estáticos

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Log the MongoDB URI
mongoose.connect(process.env.MONGODB_URI) // Conexión a la base de datos

.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Servir index.html
});

// Rutas CRUD para artículos de inventario
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.post('/items', async (req, res) => {
    if (!req.body.Nombre || !req.body.cantidad || !req.body.precioUnitario) {
        return res.status(400).send('Faltan datos requeridos.');
    }
require('dotenv').config(); // Cargar variables de entorno desde .env
const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item'); // Importar el modelo de inventario

const path = require('path'); // Importar el módulo path
const reportes = require('./reportes'); // Importar el módulo de reportes
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Servir archivos estáticos

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Log the MongoDB URI
mongoose.connect(process.env.MONGODB_URI) // Conexión a la base de datos

.then(() => {
    console.log('Conectado a MongoDB');
})
.catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Servir index.html
});

// Rutas CRUD para artículos de inventario
    if (!req.body.Nombre || !req.body.cantidad || !req.body.precioUnitario) {
        return res.status(400).send('Faltan datos requeridos.');
    }

    const item = new Item(req.body);
    try {
        await item.save();
        res.status(201).send(item);
    } catch (error) {
        console.error('Error al agregar el artículo:', error); 

        res.status(400).send(error);
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/items/:id', async (req, res) => {
    if (!req.body.Nombre && !req.body.cantidad && !req.body.precioUnitario) {
        return res.status(400).send('No se proporcionaron datos para actualizar.');
    }

    try {
        const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/items/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.send({ message: 'Artículo eliminado' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ruta para generar el reporte semanal
app.get('/reportes/semanal', (req, res) => {
    const reporte = reportes.generarReporteSemanal();
    res.send(reporte);
});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
