Trailerflix API
Esta API permite la gestión de contenido de películas y series en una plataforma de streaming. Utiliza Express y Sequelize para operaciones CRUD con una base de datos MySQL.

Configuración
Clona este repositorio.

Instala las dependencias usando:

bash
Copy code
npm install
Configura la conexión a la base de datos en el archivo .env, asegurándote de incluir tu información de base de datos, por ejemplo:


DB_HOST=localhost
DB_PORT=3306
DB_NAME=nombre_de_tu_base
DB_USER=usuario
DB_PASS=contraseña

npm run dev para iniciar el servidor

RUTAS
GET
https://trabajo-integrador-production-dc32.up.railway.app/contenido
devuelve todos los contenidos de la base de datos

GET
https://trabajo-integrador-production-dc32.up.railway.app/contenido/2
devuelve un solo contenido segun su ID

GET
https://trabajo-integrador-production-dc32.up.railway.app/contenido/search?categoria=serie&actor=pedro&titulo=mandalorian
devuelve todos los contenidos que cumplan total o parcialmente con el titulo, categoria o actor, que fueron proporciador en la query

DELETE
https://trabajo-integrador-production-dc32.up.railway.app/contenido/202
borra un contenido por ID

PUT
{
  "titulo": "las aventuras de pepe",
  "categoria": "documental",
  "poster": "./posters/updaasdted.jpg",
  "resumen": "Ups.",
  "temporadas": "",
  "trailer": "httpsler",
  "genero": "Aventura, Fantasia, Medieval",
  "reparto": "Pepe, Ricardo",
  "gen": "Epico",
  "busqueda": "palabras de busqueda"
}
actualiza las campos que enviados en la solicitud

POST
https://trabajo-integrador-production-dc32.up.railway.app/contenido
{
  "titulo": "las aventuras de pepe",
  "categoria": "documental",
  "poster": "./posters/updaasdted.jpg",
  "resumen": "Ups.",
  "temporadas": "",
  "trailer": "httpsler",
  "genero": "Aventura, Fantasia, Medieval",
  "reparto": "Pepe, Ricardo",
  "gen": "Epico",
  "busqueda": "palabras de busqueda"
}
muy similar al PUT permite crear un nuevo contenido