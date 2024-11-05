const Categoria = require('./categoria');
const Genero = require('./genero');
const Actor = require('./actor');
const Contenido = require('./contenido');
const ContenidoGenero = require('./contenidoGenero');
const ContenidoActor = require('./contenidoActor');

// Relaciones
Categoria.hasMany(Contenido, { foreignKey: 'categoria_id' });
Contenido.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Contenido.belongsToMany(Genero, { through: ContenidoGenero, foreignKey: 'contenido_id' });
Genero.belongsToMany(Contenido, { through: ContenidoGenero, foreignKey: 'genero_id' });

Contenido.belongsToMany(Actor, { through: ContenidoActor, foreignKey: 'contenido_id' });
Actor.belongsToMany(Contenido, { through: ContenidoActor, foreignKey: 'actor_id' });

module.exports = {
  Categoria,
  Genero,
  Actor,
  Contenido,
  ContenidoGenero,
  ContenidoActor
};
