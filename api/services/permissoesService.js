const database = require("../models");
const uuid = require("uuid");

class permissoesService {
  async cadastrar(dto) {
    const permissao = await database.permissoes.findOne({
      where: { nome: dto.nome },
    });

    if (permissao) {
      throw new Error("Permissao já cadastrada!");
    }

    try {
      const novaPermissao = await database.permissoes.create({
        id: uuid.v4(),
        nome: dto.nome,
        descricao: dto.descricao,
      });
      return novaPermissao;
    } catch (erro) {
      throw new Error("Erro ao cadastrar permissao");
    }
  }

  async buscarTodosAsPermissoes() {
    const permissoes = await database.permissoes.findAll();
    return permissoes;
  }

  async buscarPermissaoPorId(id) {
    const permissao = await database.permissoes.findOne({ where: { id: id } });

    if (!permissao) {
      throw new Error("Permissao não cadastrada");
    }

    return permissao;
  }

  async editarPermissao(dto) {
    const permissao = await this.buscarPermissaoPorId(dto.id);

    try {
      permissao.nome = dto.nome;
      permissao.descricao = dto.descricao;

      await permissao.save();

      return permissao;
    } catch (erro) {
      throw new Error("Erro ao editar permissao");
    }
  }

  async deletarPermissao(id) {
    const permissao = await this.buscarPermissaoPorId(id);

    try {
      await database.permissoes.destroy({
        where: {
          id: id,
        },
      });
    } catch (erro) {
      throw new Error("Erro ao tentar deletar permissao");
    }
  }
}

module.exports = permissoesService
