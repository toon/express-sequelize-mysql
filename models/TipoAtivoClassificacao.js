const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoAtivoClassificacao = sequelize.define('TipoAtivoClassificacao', {
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

module.exports = TipoAtivoClassificacao;
