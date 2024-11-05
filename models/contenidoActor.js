const { sequelize } = require('../conexion/database');

const ContenidoActor = sequelize.define('ContenidoActor', {}, {
  tableName: 'contenido_actores',
  timestamps: false
});

module.exports = ContenidoActor;
