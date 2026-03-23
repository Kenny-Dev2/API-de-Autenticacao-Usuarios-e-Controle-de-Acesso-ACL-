const { Router } = require('express');
const RoleController = require('../controllers/roleController')

const router = Router();

router
  .post('/role', RoleController.cadastrar)
  .get('/role', RoleController.buscarTodosRole)
  .get('/role/:id', RoleController.buscarRolePorId)
  .put('/role/:id', RoleController.atualizaRole)
  .delete('/role/:id', RoleController.deletaRole)

module.exports = router;