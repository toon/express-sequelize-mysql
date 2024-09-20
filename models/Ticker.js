const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticker = sequelize.define('Ticker', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    }
}, {
    timestamps: true,
    tableName: 'ticker'
});

module.exports = Ticker;
