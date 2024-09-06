const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoProvento = sequelize.define('TipoProvento', {
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

module.exports = TipoProvento;
