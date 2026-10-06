const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Operacao = sequelize.define('Operacao', {
    data: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    quantidade: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    valor_unitario: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    cotacao_dolar: {
        type: DataTypes.DOUBLE,
        allowNull: true,
    },
    taxas: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    // Campo "operacao_ir" para indicar se a operação de venda de ações dentro do limite de 20K por mês e compra no dias ou dias seguintes.
    operacao_ir: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

}, {
    timestamps: true,
    tableName: 'operacaos'
});

module.exports = Operacao;
