const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ParMoeda = sequelize.define('ParMoeda', {
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

module.exports = ParMoeda;
