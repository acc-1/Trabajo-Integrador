const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')

dotenv.config();

const { DBUSER, PASSWORD, HOST, DATABASE, PORT } = process.env;

const sequelize = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  host: HOST,
  port: PORT, // Especifica el puerto aquí
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000
  },
});


const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
};


connectToDatabase();

module.exports = { sequelize };
