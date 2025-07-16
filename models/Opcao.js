const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Opcao = sequelize.define('Opcao', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vencimento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    preco_aquisicao: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    quantidade: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    investido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    strike: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    premio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'opcao'
});

module.exports = Opcao;
