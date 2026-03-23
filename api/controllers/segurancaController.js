const SegurancaService = require("../services/segurancaService");
const segurancaService = new SegurancaService();

class SegurancaController {
  static async cadastrarAcl(req, res) {
    const { role, permissao } = req.body;
    const { usuarioId } = req;

    try {
      const acl = await segurancaService.cadastrarAcl({
        role,
        permissao,
        usuarioId,
      });
      res.status(200).send(acl);
    } catch (erro) {
      res.status(401).send({ message: erro.message });
    }
  }

  static async cadastrarPermissoesRoles(req, res) {
    const { roleId, permissao } = req.body;

    try {
      const permissoesRole = await segurancaService.cadastrarPermissoesRoles({
        roleId,
        permissao,
      });
      res.status(200).send(permissoesRole);
    } catch (erro) {
      res.status(401).send({ message: erro.message });
    }
  }
}

module.exports = SegurancaController;
