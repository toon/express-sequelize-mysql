const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Opcao = sequelize.define('Opcao', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    data_abertura: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_vencimento: {
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
    strike_inicial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    premio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    resultado: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    taxas: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    data_recompra: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    preco_recompra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    // Indicar o preço do ativo no momento da compra da opção
    preco_ativo_na_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    // Indicar o preço do ativo no momento da recompra ou exercício da opção    
    preco_ativo_no_encerramento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    
}, {
    timestamps: true,
    tableName: 'Opcao'
});

module.exports = Opcao;
