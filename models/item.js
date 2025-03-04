const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Nombre: { // Cambiado a Nombre
        type: String,
        required: true
    },
    cantidad: { // Cambiado a cantidad
        type: Number,
        required: true
    },
    precioUnitario: { // Se mantiene como precioUnitario
        type: Number,
        required: true
    },
    Descripción: { // Cambiado a Descripción
        type: String,
        required: false
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;