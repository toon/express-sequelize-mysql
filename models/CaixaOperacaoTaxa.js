const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CaixaOperacaoTaxa = sequelize.define('CaixaOperacaoTaxa', {
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    valor: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    saldo: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    // tableName: 'provento'
});

module.exports = CaixaOperacaoTaxa;
