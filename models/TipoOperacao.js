const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoOperacao = sequelize.define('TipoOperacao', {
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

module.exports = TipoOperacao;
