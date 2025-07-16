const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoOpcaoStatus = sequelize.define('TipoOpcaoStatus', {
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

module.exports = TipoOpcaoStatus;
