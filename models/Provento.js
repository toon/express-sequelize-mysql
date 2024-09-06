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
    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: true
});

module.exports = Provento;
