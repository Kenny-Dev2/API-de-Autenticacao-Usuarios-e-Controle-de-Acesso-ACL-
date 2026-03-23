const UsuarioService = require('../services/usuarioService.js');

const usuarioService = new UsuarioService();

class UsuarioController {
  static async cadastrar(req, res) {
    const { nome, email, senha } = req.body;
    try {
      const usuario = await usuarioService.cadastrar({ nome, email, senha });
      res.status(201).send('usuario cadastrado!');
    } catch (erro) {
      res.status(401).send({ erro: erro.message })
    }
  }

  static async buscarTodosUsuarios(req, res) {
    try {      
      const usuarios = await usuarioService.buscarTodosOsUsuarios();
      res.status(200).send(usuarios);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async buscarUsuarioPorId(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.buscarUsuarioPorId(id);
      res.status(200).send(usuario);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async atualizaUsuario(req, res) {
    try {
      const { id } = req.params;
      const { nome, email } = req.body;

      const usuario = await usuarioService.editarUsuario({ id, nome, email });
      res.status(200).json(usuario);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async deletaUsuario(req, res) {
    try {
      const { id } = req.params;
      await usuarioService.deletarUsuario(id);
      res.status(200).send({message: "usuario deletado com sucesso."})
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }
}

module.exports = UsuarioController;