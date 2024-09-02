const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Estrategia = sequelize.define('Estrategia', {
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

module.exports = Estrategia;
