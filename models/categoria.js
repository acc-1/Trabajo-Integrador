const { DataTypes } = require('sequelize');
const { sequelize } = require('../conexion/database');

const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
  }
}, {
  tableName: 'categorias',
  timestamps: false
});

module.exports = Categoria;
