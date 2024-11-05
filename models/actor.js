const { DataTypes } = require('sequelize');
const { sequelize } = require('../conexion/database');

const Actor = sequelize.define('Actor', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, {
  tableName: 'actores',
  timestamps: false
});

module.exports = Actor;
