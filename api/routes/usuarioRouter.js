const { Router } = require('express');
const UsuarioController = require('../controllers/usuarioController.js');
const autenticado = require('../middleware/autenticado')

const router = Router();

router.use(autenticado);

router
  .post('/usuarios', UsuarioController.cadastrar)
  .get('/usuarios', UsuarioController.buscarTodosUsuarios)
  .get('/usuarios/id/:id', UsuarioController.buscarUsuarioPorId)
  .put('/usuarios/id/:id', UsuarioController.atualizaUsuario)
  .delete('/usuarios/id/:id', UsuarioController.deletaUsuario)

module.exports = router