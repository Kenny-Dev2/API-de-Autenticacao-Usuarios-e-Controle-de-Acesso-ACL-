const AuthService = require('../services/authService.js');

const authService = new AuthService();

class authController {
  static async login(req, res) {
    const { email, senha } = req.body;

    try {
      const login = await authService.login({ email, senha })
      res.status(200).send(login)
    } catch (erro) {
      res.status(404).send({ message: erro.message })
    }
  }
}

module.exports = authController