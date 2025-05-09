const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoAtivo = sequelize.define('TipoAtivo', {
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

module.exports = TipoAtivo;
