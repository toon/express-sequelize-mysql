const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Carteira = sequelize.define('Carteira', {
    nome: {
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

module.exports = Carteira;
