const { DataTypes } = require('sequelize');
const { sequelize } = require('../conexion/database');

const Contenido = sequelize.define('Contenido', {
  poster: {
    type: DataTypes.STRING(255),
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  gen: {
    type: DataTypes.STRING(50),
  },
  busqueda: {
    type: DataTypes.TEXT,
  },
  resumen: {
    type: DataTypes.TEXT,
  },
  temporadas: {
    type: DataTypes.STRING(10),
  },
  trailer: {
    type: DataTypes.STRING(255),
  }
}, {
  tableName: 'contenido',
  timestamps: false
});

module.exports = Contenido;
