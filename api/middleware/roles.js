const database = require('../models')

const roles = (listaRoles) => {
  return async (req, res, next) => {
    const { usuarioId } = req
    const usuario = await database.usuarios.findOne({
      include: [
        {
          model: database.roles,
          as: "usuarios_dos_roles",
          attributes: ['id', 'nome']
        }
      ],
      where: {
        id: usuarioId
      }
    })

    if (!usuario) {
      return res.status(401).send('usuario não cadastrado')
    }

    const rolesCadastradas = usuario.usuarios_dos_roles.map((role) => role.nome).some((role) => listaRoles.includes(role))

    if(!rolesCadastradas) {
      return res.status(401).send('usuario não tem acesso a esta rota')
    }

    return next()
  }
}

module.exports = roles;