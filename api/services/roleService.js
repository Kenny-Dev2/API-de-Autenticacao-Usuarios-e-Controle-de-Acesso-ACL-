const database = require('../models')
const uuid = require('uuid')

class roleService {
  async cadastrar(dto) {
    const role = await database.roles.findOne({
      where: {
        nome: dto.nome
      }
    })

    if (role) {
      throw new Error('Já existe um role com esse nome')
    }

    try {
      const novaRole = await database.roles.create({
        id: uuid.v4(),
        nome: dto.nome,
        descricao: dto.descricao
      })

      return novaRole;
    } catch (erro) {
      throw new Error('Erro ao cadastrar role')
    }
  }

  async buscarTodosOsRoles() {
    const roles = await database.roles.findAll();
    return roles;
  }

  async buscarRolePorId(id) {
    const role = await database.roles.findOne({ where: { id: id } });

    if (!role) {
      throw new Error('Role não cadastrado!')
    }

    return role;
  }

  async editarRole(dto) {
    const role = await this.buscarRolePorId(dto.id);

    try {

      role.nome = dto.nome
      role.descricao = dto.descricao

      await role.save()

      return role;
    } catch (erro) {
      throw new Error('Erro ao editar role')
    }
  }

  async deletarRole(id) {
    const role = await this.buscarRolePorId(id)

    try {
      await database.roles.destroy({ where: {
          id: id
        } 
      })
    } catch (erro) {
      throw new Error('Erro ao tentar deletar role')
    }
  }
}

module.exports = roleService