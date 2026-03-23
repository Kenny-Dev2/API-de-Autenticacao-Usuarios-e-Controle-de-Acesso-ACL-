const PermissoesService = require("../services/permissoesService");

const permissoesService = new PermissoesService();

class permissoesController {
  static async cadastrar(req, res) {
    try {
      const { nome, descricao } = req.body;
      const permissao = await permissoesService.cadastrar({ nome, descricao });
      res.status(201).send(permissao);
    } catch (erro) {
      res.status(401).send({ message: erro.message });
    }
  }

  static async buscarTodasPermissoes(req, res) {
    try {
      const permissoes = await permissoesService.buscarTodosAsPermissoes();
      res.status(200).send(permissoes);
    } catch (erro) {
      res.status(400).send({ erro: erro.message });
    }
  }

  static async buscarPermissaoPorId(req, res) {
    try {
      const { id } = req.params;
      const permissao = await permissoesService.buscarPermissaoPorId(id);
      res.status(200).send(permissao);
    } catch (erro) {
      res.status(400).send({ erro: erro.message });
    }
  }

  static async atualizaPermissao(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const permissao = await permissoesService.editarPermissao({
        id,
        nome,
        descricao,
      });
      res.status(200).json(permissao);
    } catch (erro) {
      res.status(400).send({ erro: erro.message });
    }
  }

  static async deletaPermissao(req, res) {
    try {
      const { id } = req.params;
      await permissoesService.deletarPermissao(id);
      res.status(200).send({ message: "permissao deletado com sucesso." });
    } catch (erro) {
      res.status(400).send({ erro: erro.message });
    }
  }
}

module.exports = permissoesController;
