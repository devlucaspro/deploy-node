const Sequelize = require('sequelize');
const connection = require('./database');

// Creating table with sequelize - MODEL
const Pergunta = connection.define('perguntas', {
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

// Sync it to not create a new table if it already exists
Pergunta.sync({force: false}).then(() => {
  console.log('Pergunta table created!');
})

module.exports = Pergunta;