const RoleService = require('../services/roleService')

const roleService = new RoleService();

class roleController {
  static async cadastrar(req, res) {
    try {
      const { nome, descricao } = req.body;
      const role = await roleService.cadastrar({ nome, descricao })
      res.status(201).send(role)
    } catch (erro) {
      res.status(401).send({ message: erro.message })
    }
  }

  static async buscarTodosRole(req, res) {
    try {      
      const roles = await roleService.buscarTodosOsRoles();
      res.status(200).send(roles);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async buscarRolePorId(req, res) {
    try {
      const { id } = req.params;
      const role = await roleService.buscarRolePorId(id);
      res.status(200).send(role);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async atualizaRole(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao } = req.body;

      const role = await roleService.editarRole({ id, nome, descricao });
      res.status(200).json(role);
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }

  static async deletaRole(req, res) {
    try {
      const { id } = req.params;
      await roleService.deletarRole(id);
      res.status(200).send({message: "role deletado com sucesso."})
    } catch (erro) {
      res.status(400).send({erro: erro.message})
    }
  }
}

module.exports = roleController