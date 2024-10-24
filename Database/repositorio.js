//Se usara el npm 'Sequelize' para interactuar con la Base de Datos
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');

// Credenciales de la base de datos
const databaseName = 'Tareas';
const username = 'root';
const password = '';
const host = 'localhost';

// Función para crear la base de datos si no existe
const createDatabaseIfNotExists = async (databaseName) => {
  try {
    const connection = await mysql.createConnection({ host, user: username, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);

    console.log(`Database "${databaseName}" created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1); // Salir si ocurre un error al crear la base de datos
  }
};

// Crear la base de datos antes de inicializar Sequelize
createDatabaseIfNotExists(databaseName);

// Configuración de Sequelize
const sequelize = new Sequelize(databaseName, username, password, {
//Servidor: Localhost
  host: host,
//Dialecto en MySQL
  dialect: 'mysql',
});

// Definición del modelo Lista
const Lista = sequelize.define('Lista', {
  Id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  Hacer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  Compras: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'Lista',
  timestamps: false, // Sin timestamps
});

// Intentar conectar y sincronizar
const connectAndSync = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
  
      // Sincronizar modelos
      await sequelize.sync();
      console.log('Models synchronized successfully.');
  
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      process.exit(1); // Salir si ocurre otro error
    }
  };
  
  connectAndSync();

// Exportar la función y el modelo
module.exports = {
  sequelize,
  Lista,
};