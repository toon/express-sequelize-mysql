const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Operacao = sequelize.define('Operacao', {
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    quantidade: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    valor_unitario: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    cotacao_dolar: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    taxas: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: true
});

module.exports = Operacao;
