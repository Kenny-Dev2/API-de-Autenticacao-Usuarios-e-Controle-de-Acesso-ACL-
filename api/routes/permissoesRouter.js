const { Router } = require("express");
const PermissoesController = require("../controllers/permissoesController");

const router = Router();

router
  .post("/permissao", PermissoesController.cadastrar)
  .get("/permissao", PermissoesController.buscarTodasPermissoes)
  .get("/permissao/:id", PermissoesController.buscarPermissaoPorId)
  .put("/permissao/:id", PermissoesController.atualizaPermissao)
  .delete("/permissao/:id", PermissoesController.deletaPermissao);

module.exports = router;
