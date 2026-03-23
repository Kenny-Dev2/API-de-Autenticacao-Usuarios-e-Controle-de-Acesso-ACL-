const database = require("../models");
const { hash } = require("bcryptjs");
const uuid = require("uuid");

class UsuarioService {
  async cadastrar(dto) {
    const usuario = await database.usuarios.findOne({
      where: {
        email: dto.email,
      },
    });

    if (usuario) {
      throw new Error("Usuario já cadastrado!");
    }

    try {
      const senhaHash = await hash(dto.senha, 8);
      const novoUsuario = await database.usuarios.create({
        id: uuid.v4(),
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
      });
      return novoUsuario;
    } catch (erro) {
      throw new Error("Erro ao cadastrar usuario!");
    }
  }

  async buscarTodosOsUsuarios() {
    const usuarios = await database.usuarios.findAll({
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
    });

    return usuarios;
  }

  async buscarUsuarioPorId(id) {
    const usuario = await database.usuarios.findOne({ where: { id: id } });

    if (!usuario) {
      throw new Error("Usuario informado não cadastrado!");
    }

    return usuario;
  }

  async editarUsuario(dto) {
    const usuario = await this.buscarUsuarioPorId(dto.id);

    try {
      usuario.nome = dto.nome;
      usuario.email = dto.email;

      await usuario.save();

      return usuario;
    } catch (erro) {
      throw new Error("Erro ao editar usuario");
    }
  }

  async deletarUsuario(id) {
    await this.buscarUsuarioPorId(id);

    try {
      await database.usuarios.destroy({
        where: {
          id: id,
        },
      });
    } catch {
      throw new Error("Erro ao tentar deletar usuario");
    }
  }
}

module.exports = UsuarioService;
