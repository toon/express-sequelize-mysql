const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoOperacaoTaxa = sequelize.define('TipoOperacaoTaxa', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_abertura: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_encerramento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    caixa: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
}, {
    timestamps: true
});

module.exports = TipoOperacaoTaxa;
