const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Provento = sequelize.define('Provento', {
    data: {
        type: DataTypes.DATE,
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
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'provento'
});

module.exports = Provento;
