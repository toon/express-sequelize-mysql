const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Moeda = sequelize.define('Moeda', {
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
    timestamps: true
});

module.exports = Moeda;
