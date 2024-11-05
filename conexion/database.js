const { Sequelize } = require('sequelize');


process.loadEnvFile();


const { DBUSER, PASSWORD, HOST, DATABASE } = process.env;


const sequelize = new Sequelize(DATABASE, DBUSER, PASSWORD, {
  host: HOST,
  dialect: 'mysql',
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
