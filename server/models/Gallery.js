// Definición del modelo en gallery.js
const { Sequelize, DataTypes, Model } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false, // Desactiva los logs de Sequelize (opcional)
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  ssl: true,
});

class Gallery extends Model { }

Gallery.init({
  url: DataTypes.STRING,
  //key: DataTypes.STRING,
  title: DataTypes.STRING,
  medidas: DataTypes.STRING,
  slug: {
    type: DataTypes.STRING,
    unique: true
  }
}, {
  sequelize,
  modelName: 'Gallery',
});
Gallery.sync({ force: true })
module.exports = Gallery;