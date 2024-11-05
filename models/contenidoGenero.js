const { sequelize } = require('../conexion/database');

const ContenidoGenero = sequelize.define('ContenidoGenero', {}, {
  tableName: 'contenido_generos',
  timestamps: false
});

module.exports = ContenidoGenero;
