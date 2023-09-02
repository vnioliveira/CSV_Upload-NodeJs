const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Configuração do middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/csv_upload', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
  console.log('Conexão com o banco de dados MongoDB estabelecida com sucesso!');
});

// Rotas da API RESTful
const csvRoutes = require('./src/routes/csvRoutes');
app.use('/api/csv', csvRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
