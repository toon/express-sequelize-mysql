const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoOpcaoOperacao = sequelize.define('TipoOpcaoOperacao', {
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

module.exports = TipoOpcaoOperacao;
