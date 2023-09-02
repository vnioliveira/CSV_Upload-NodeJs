const express = require('express');
const router = express.Router();
const file_controller = require('../controllers/file_controller');
const upload = multer({ dest: 'uploads/files'})

// Rota para fazer upload de um arquivo CSV
router.post('/api/users', upload.single('file') ,fileController.upload);

// Rota para obter todos os registros do banco de dados
router.get('/view/:id', fileController.getAll);

// Rota para buscar arquivos por qualquer atributo
router.get('/api/users', fileController.search);

// Rota para excluir um registro específico pelo ID
router.get('/delete/:id', fileController.delete);

module.exports = router;
