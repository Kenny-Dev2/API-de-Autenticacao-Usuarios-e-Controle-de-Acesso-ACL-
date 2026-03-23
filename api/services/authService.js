const database = require('../models')
const { compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const secret = require('../config/jsonSecret')

class authService {
  async login(dto) {
    const usuario = await database.usuarios.findOne({
      attributes: ['id', 'email', 'senha'],
      where: {
        email: dto.email
      }
    })

    if (!usuario) {
      throw new Error('Usuario não cadastrado')
    }

    const senhasIguais = await compare(dto.senha, usuario.senha);

    if(!senhasIguais) {
      throw new Error('Email ou a senha do usuario invalido')
    }

    const accessToken = sign({
      id: usuario.id,
      email: usuario.email
    }, secret.secret, {
      expiresIn: 86400
    })

    return { accessToken }
  }
}

module.exports = authService;