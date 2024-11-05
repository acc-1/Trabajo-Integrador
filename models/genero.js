// Model for Genero
const { DataTypes } = require('sequelize');
const { sequelize } = require('../conexion/database');

const Genero = sequelize.define('Genero', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  tableName: 'generos',
  timestamps: false
});

module.exports = Genero;
