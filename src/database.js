const mongoose = require('mongoose');

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/gestor-inventario', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conectado a la base de datos');
})
.catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});

// Definición del esquema de artículo
const itemSchema = new mongoose.Schema({
    Nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    Descripción: { type: String, required: false },
});

// Modelo de artículo
const Item = mongoose.model('Item', itemSchema);

// Exportar el modelo
module.exports = Item;
