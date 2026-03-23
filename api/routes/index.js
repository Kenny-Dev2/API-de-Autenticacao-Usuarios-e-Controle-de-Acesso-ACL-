const bodyParser = require("body-parser");

const produto = require("./produtoRoute");
const usuario = require("./usuarioRouter");
const auth = require("./authRouter");
const role = require("./roleRouter");
const permissoes = require("./permissoesRouter");
const seguranca = require("./segurancaRouter")

module.exports = (app) => {
  app.use(bodyParser.json(), auth, usuario, produto, role, permissoes, seguranca);
};
