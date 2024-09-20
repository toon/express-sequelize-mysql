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
    investido: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    proventos: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: false
});

module.exports = Dashboard;
