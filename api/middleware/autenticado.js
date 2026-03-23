const { verify, decode } = require('jsonwebtoken')
const secret = require('../config/jsonSecret')

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send('Acess token não informado');
  }

  const [, accessToken] = token.split(" ");

  try {
    verify(accessToken, secret.secret);

    const { id, email } = await decode(accessToken);

    req.usuarioId = id
    req.usuarioEmail = email

    return next()
  } catch (erro) {
    res.status(401).send('Usuario não autorizado!');
  }
}