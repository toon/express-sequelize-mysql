const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OperacaoTaxaStatus = sequelize.define('OperacaoTaxaStatus', {
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

module.exports = OperacaoTaxaStatus;
