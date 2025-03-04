const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    Nombre: { // Cambiado a Nombre
        type: String,
        required: true
    },
    cantidad: { // Cambiado a cantidad
        type: Number,
        required: true,
        min: 0 // Validación para que sea un número positivo
    },

    precioUnitario: { // Se mantiene como precioUnitario
        type: Number,
        required: true,
        min: 0 // Validación para que sea un número positivo
    },

    Descripción: { // Cambiado a Descripción
        type: String,
        required: false
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
