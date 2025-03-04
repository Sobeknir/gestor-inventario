const mongoose = require('mongoose');

const reporteDiarioSchema = new mongoose.Schema({
    totalIngresos: Number,
    totalRetiros: Number,
    productosVendidos: Object,
    productoMasVendido: Object,
    stockInicial: Object,
    stockFinal: Object,
    fecha: { type: Date, default: Date.now },
    transacciones: [{ tipo: String, nombre: String, cantidad: Number, timestamp: Date }],
    comentarios: String
});

const ReporteDiario = mongoose.model('ReporteDiario', reporteDiarioSchema);

module.exports = ReporteDiario;