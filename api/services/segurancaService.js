const database = require("../models");
const Sequelize = require("sequelize");

class SegurancaService {
  async cadastrarAcl(dto) {
    const usuario = await database.usuarios.findOne({
      include: [
        {
          model: database.roles,
          as: "usuarios_dos_roles",
          attributes: ["id", "nome", "descricao"],
        },
        {
          model: database.permissoes,
          as: "usuarios_tem_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
      where: {
        id: dto.usuarioId,
      },
    });

    if (!usuario) {
      throw new Error("Usuario não cadastrado");
    }

    const rolesCadastradas = await database.roles.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: dto.role,
        },
      },
    });

    const permissoesCadastradas = await database.permissoes.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: dto.permissao,
        },
      },
    });

    await usuario.removeUsuarios_dos_roles(usuario.usuarios_dos_roles);
    await usuario.removeUsuarios_tem_permissoes(
      usuario.usuarios_tem_permissoes,
    );

    await usuario.addUsuarios_dos_roles(rolesCadastradas);
    await usuario.addUsuarios_tem_permissoes(permissoesCadastradas);

    const novoUsuario = await database.usuarios.findOne({
      include: [
        {
          model: database.roles,
          as: "usuarios_dos_roles",
          attributes: ["id", "nome", "descricao"],
        },
        {
          model: database.permissoes,
          as: "usuarios_tem_permissoes",
          attributes: ["id", "nome", "descricao"],
        },
      ],
      where: {
        id: dto.usuarioId
      }
    });

    return novoUsuario;
  }

  async cadastrarPermissoesRoles(dto) {
    const role = await database.roles.findOne({
      include: [
        {
          model: database.permissoes,
          as: 'roles_da_permissoes',
          attributes: ['id', 'nome', 'descricao']
        }
      ],
      where: {
        id: dto.roleId
      }
    })

    if (!role) {
      throw new Error('Role não cadastrada')
    }

    const permissoesCadastradas = await database.permissoes.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: dto.permissao
        }
      }
    })

    await role.removeRoles_da_permissoes(role.roles_da_permissoes)
    await role.addRoles_da_permissoes(permissoesCadastradas)

    const novoRole = await database.roles.findOne({
      include: [
        {
          model: database.permissoes,
          as: 'roles_da_permissoes',
          attributes: ['id', 'nome', 'descricao']
        }
      ],
      where: {
        id: dto.roleId
      }
    })

    return novoRole
  }
}

module.exports = SegurancaService;
