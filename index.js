// nodemon index.js
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Database - Warning if this works correctly
connection.authenticate()
.then(() => {
  console.log('Connection has been established successfully.'); 
})
.catch((error) => {
  console.error('Unable to connect to the database:', error);
});

// I'm telling express to use ejs as view engine
app.set("view engine", "ejs");
app.use(express.static('public')); // static files

// bodyParser - used to get data from http request to JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  Pergunta.findAll({ raw: true, order: [
    ['id', 'DESC'] // DESC = Decrecente || ASC = Crescente
  ]}).then(perguntas => {
    res.render('index', {
      perguntas: perguntas
    });
  });
});

app.get("/perguntas", (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect('/')
  });
});

// Always send to the view the variables we need
app.get('/pergunta/:id', (req, res) => {
  let id = req.params.id;
  Pergunta.findOne({
    where: { id: id }
  }).then((pergunta) => {
    if(pergunta != undefined) { // Pergunta encontrada

      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [
          ['id', 'DESC']
        ]
      }).then((respostas) => {
        res.render('pergunta', {
          pergunta: pergunta,
          respostas: respostas
        })
      })

    } else { // Pergunta não encontrada
      res.redirect('/');
    }
  })
})

app.post('/responder', (req, res) => {
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect('/pergunta/' + perguntaId);
  })
});

app.listen(8080, () => {console.log("App rodando!")}); 


// always turn on the mysql in cmd
// mysql -h localhost -u root -p

// mysql workbench to create database > new schema

// Dependencies so far:
// express
// mysql2
// sequelize
// body-parser