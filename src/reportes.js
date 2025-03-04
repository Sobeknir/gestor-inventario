let reportes = {
    items: {},
    totalGanado: 0,
    productoMasVendido: { nombre: '', cantidad: 0 },
    reportesSemanales: [], // Array para almacenar reportes semanales
    reportesDiarios: [], // Array para almacenar reportes diarios

    agregarIngreso: function(nombre, cantidad, precioUnitario) {
        if (!this.items[nombre]) {
            this.items[nombre] = { cantidadIngresada: 0, cantidadRetirada: 0, totalGanado: 0, stockInicial: 0 };
        }
        this.items[nombre].cantidadIngresada += cantidad;
        this.items[nombre].totalGanado += cantidad * precioUnitario;
        this.totalGanado += cantidad * precioUnitario;
    },

    agregarRetiro: function(nombre, cantidad) {
        if (!this.items[nombre]) {
            this.items[nombre] = { cantidadIngresada: 0, cantidadRetirada: 0, totalGanado: 0, stockInicial: 0 };
        }
        this.items[nombre].cantidadRetirada += cantidad;

        // Verificar si este producto es el más vendido
        if (this.items[nombre].cantidadRetirada > this.productoMasVendido.cantidad) {
            this.productoMasVendido.nombre = nombre;
            this.productoMasVendido.cantidad = this.items[nombre].cantidadRetirada;
        }
    },

    obtenerReportes: function() {
        return {
            items: this.items,
            totalGanado: this.totalGanado,
            productoMasVendido: this.productoMasVendido
        };
    },

    generarReporteSemanal: async function() {
        let totalIngresos = 0;
        let totalRetiros = 0;
        let productosVendidos = {};
        let stockInicial = {};
        let stockFinal = {};

        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - 7); // 7 días atrás
        startDate.setHours(7, 0, 0); // Establecer a las 7 AM

        for (let nombre in this.items) {
            totalIngresos += this.items[nombre].totalGanado;
            totalRetiros += this.items[nombre].cantidadRetirada;

            if (this.items[nombre].cantidadRetirada > 0) {
                productosVendidos[nombre] = this.items[nombre].cantidadRetirada;
            }

            // Registrar stock inicial y final
            stockInicial[nombre] = this.items[nombre].cantidadIngresada - this.items[nombre].cantidadRetirada;
            stockFinal[nombre] = this.items[nombre].cantidadIngresada;
        }

        // Crear el reporte semanal
        const reporteSemanal = {
            totalIngresos: totalIngresos,
            totalRetiros: totalRetiros,
            productosVendidos: productosVendidos,
            productoMasVendido: this.productoMasVendido,
            stockInicial: stockInicial,
            stockFinal: stockFinal
        };

        // Almacenar el reporte semanal en la base de datos
        const ReporteSemanal = require('./models/reporteSemanal'); // Importar el modelo de reporte
        const nuevoReporteSemanal = new ReporteSemanal(reporteSemanal);
        await nuevoReporteSemanal.save();

        return reporteSemanal;
    },

    generarReporteDiario: async function() {
        let totalIngresos = 0;
        let totalRetiros = 0;
        let productosVendidos = {};
        let stockInicial = {};
        let stockFinal = {};
        
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // Obtener la fecha actual

        for (let nombre in this.items) {
            totalIngresos += this.items[nombre].totalGanado;
            totalRetiros += this.items[nombre].cantidadRetirada;

            if (this.items[nombre].cantidadRetirada > 0) {
                productosVendidos[nombre] = this.items[nombre].cantidadRetirada;
            }

            // Registrar stock inicial y final
            stockInicial[nombre] = this.items[nombre].cantidadIngresada - this.items[nombre].cantidadRetirada;
            stockFinal[nombre] = this.items[nombre].cantidadIngresada;
        }

        // Crear el reporte diario
        const reporteDiario = {
            totalIngresos: totalIngresos,
            totalRetiros: totalRetiros,
            productosVendidos: productosVendidos,
            productoMasVendido: this.productoMasVendido,
            stockInicial: stockInicial,
            stockFinal: stockFinal,
            fecha: today
        };

        // Almacenar el reporte diario en la base de datos
        const ReporteDiario = require('../models/reporteDiario'); // Importar el modelo de reporte
        const nuevoReporteDiario = new ReporteDiario(reporteDiario);
        await nuevoReporteDiario.save();

        return reporteDiario;
    },

    obtenerReportesSemanales: function() {
        return this.reportesSemanales;
    },

    obtenerReportesDiarios: function() {
        return this.reportesDiarios;
    }
};

module.exports = {
    generarReporteSemanal: () => {
        return reportes.generarReporteSemanal(); // Llamar a la función del objeto reportes
    },
    generarReporteDiario: () => {
        return reportes.generarReporteDiario(); // Llamar a la función del objeto reportes
    }
};
