const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Dashboard = sequelize.define('Dashboard', {
    quantidade: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    preco_medio: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    preco_medio_real: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    preco_medio_historico: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    investido: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    valor_investido: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    investido_real: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    proventos: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    proventos_real: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    lucro_realizado: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    lucro_realizado_real: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    
}, {
    timestamps: false
});

module.exports = Dashboard;
