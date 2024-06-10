const Sequelize = require('sequelize').Sequelize;
const dotenv = require('dotenv');
dotenv.config()

const fs = require("fs");
const path = require("path");

//Configura los parámetros de conexión a tu base de datos PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Desactiva los logs cd clientde Sequelize (opcional)
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  ssl: true, 
});

//! este sequelize es para RENDERIZADO... DEPLOY DB en render.s.

// const sequelize = new Sequelize("postgres://gallery_fixd_user:N8lQwLATfQEyDxhHfv0k2LZGzMHs9cGK@dpg-cote8eq1hbls73a6epc0-a.oregon-postgres.render.com/gallery_fixd", {
//   logging: false,
//   native: false,
//   dialectOptions: {
//     ssl: true, // Deshabilitar la conexión SSL/TLS
//   },
// });

//cargamos los archivos en los modelos dinamicos
const basename = path.basename(__filename);
const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

//modelDefiners.forEach((model) => model(sequelize));

let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  Gallery
} = sequelize.models;

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

// Sincroniza el modelo con la base de datos
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa a la base de datos PostgreSQL');
    await sequelize.sync({ force: false })
      .then(() => {
        console.log(`La base de datos y las tablas han sido creadas`);
      });
    await Gallery; // Crea la tabla si no existe
    console.log('Tabla "Gallery" sincronizada correctamente');
  } catch (error) {
    console.error('Error al conectar o sincronizar la base de datos:', error);
  }
})();