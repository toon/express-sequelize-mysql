const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PosicaoAtivo = sequelize.define('PosicaoAtivo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true // Desabilita auto incremento padrão
    },
    TickerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'ticker',
            key: 'id'
        }
    },
    data_abertura: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    data_fechamento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = PosicaoAtivo;
