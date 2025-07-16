const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipoOpcaoPeriodo = sequelize.define('TipoOpcaoPeriodo', {
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

module.exports = TipoOpcaoPeriodo;
