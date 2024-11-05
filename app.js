const express = require('express');
const app = express();
const contenidoRoutes = require('./routes/contenidoRoutes');
const { sequelize } = require('./conexion/database'); // Importa la instancia de Sequelize
const fs = require('fs');
const path = require('path');
const { Categoria, Genero, Actor, Contenido, ContenidoGenero, ContenidoActor } = require('./models/relaciones');
// Middlewares
app.use(express.json());

app.use('/contenido', contenidoRoutes);
// Main function
async function loadData() {
  const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'json/trailerflix.json'), 'utf-8'));

  try {
      for (const item of jsonData) {
          // Insert or get category
          const [categoryRecord] = await Categoria.findOrCreate({ where: { nombre: item.categoria } });

          // Insert content with checks for missing fields
          const newContent = await Contenido.create({
              titulo: item.titulo,
              categoria_id: categoryRecord.id,
              poster: item.poster,
              resumen: item.resumen,
              temporadas: item.temporadas || 'N/A',  // Default to 'N/A' if missing
              trailer: item.trailer,
              gen: item.gen || null,  // Set to null if not present
              busqueda: item.busqueda || null  // Set to null if not present
          });

          // Insert genres and create relationships in contenido_genero
          const genres = item.genero ? item.genero.split(',').map(genre => genre.trim()) : [];
          for (const genreName of genres) {
              const [genreRecord] = await Genero.findOrCreate({ where: { nombre: genreName } });
              await ContenidoGenero.create({
                  contenido_id: newContent.id,
                  genero_id: genreRecord.id
              });
          }

          // Insert actors and create relationships in contenido_actor
          const actors = item.reparto ? item.reparto.split(',').map(actor => actor.trim()) : [];
          for (const actorName of actors) {
              const [actorRecord] = await Actor.findOrCreate({ where: { nombre: actorName } });
              await ContenidoActor.create({
                  contenido_id: newContent.id,
                  actor_id: actorRecord.id
              });
          }
      }

      console.log('Data loaded successfully!');
  } catch (error) {
      console.error('Error loading data:', error);
  }
}

// para migrar los datos del json solo es necesario descomentar la llamada a la funcion loadDatra();
// loadData();

// manejo de errores para rutas no existentes
app.use((req, res) => {
    res.status(404).send('404 Ruta no encontrada');
  })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

