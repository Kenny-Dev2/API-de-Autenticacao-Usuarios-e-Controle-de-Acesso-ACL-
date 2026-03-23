# API de Autenticacao, Usuarios e Permissoes

API REST em Node.js com Express, Sequelize, JWT e controle basico de acesso por usuarios, roles e permissoes.

## Visao Geral

O projeto implementa:

- autenticacao com JWT
- cadastro e manutencao de usuarios
- cadastro e manutencao de produtos
- cadastro e manutencao de roles
- cadastro e manutencao de permissoes
- associacao de roles e permissoes diretamente a usuarios via ACL
- associacao de permissoes a roles

Stack principal:

- Node.js 18.15.0
- Express 4
- Sequelize 6
- SQLite em desenvolvimento
- PostgreSQL previsto para `test` e `production`
- JWT com `jsonwebtoken`
- hash de senha com `bcryptjs`

## Arquitetura

O codigo esta organizado em camadas:

- `api/index.js`: bootstrap do servidor HTTP
- `api/routes/`: definicao de endpoints
- `api/controllers/`: adaptacao HTTP e tratamento de respostas
- `api/services/`: regras de negocio e acesso aos modelos
- `api/models/`: modelos Sequelize e associacoes
- `api/migrations/`: estrutura do banco de dados
- `api/middleware/`: autenticacao por token JWT
- `api/config/`: configuracoes de banco e segredo JWT

## Entidades do Dominio

### Usuario

- `id` UUID
- `nome`
- `email`
- `senha`

Observacao: o model possui `defaultScope` para ocultar `senha` nas consultas padrao.

### Produto

- `id` UUID
- `nome`
- `descricao`
- `preco`

### Role

- `id` UUID
- `nome`
- `descricao`

### Permissao

- `id` UUID
- `nome`
- `descricao`

### Relacionamentos

- `usuarios` N:N `roles` via `usuarios_roles`
- `usuarios` N:N `permissoes` via `usuarios_permissoes`
- `roles` N:N `permissoes` via `roles_permissoes`

## Requisitos

- Node.js 18.x
- npm 9+

## Instalacao

```bash
npm install
```

## Execucao

```bash
npm start
```

Servidor padrao:

```text
http://localhost:3000
```

## Banco de Dados

Configuracao atual:

- `development`: SQLite em `api/database/database.sqlite`
- `test`: PostgreSQL
- `production`: PostgreSQL

As migrations do projeto estao em `api/migrations/`.

Se quiser recriar o banco a partir das migrations:

```bash
npx sequelize-cli db:migrate
```

## Autenticacao

O login retorna um `accessToken` JWT.

Endpoint:

```http
POST /auth/login
```

Payload:

```json
{
  "email": "usuario@empresa.com",
  "senha": "123456"
}
```

Resposta:

```json
{
  "accessToken": "jwt-token"
}
```

Para rotas protegidas, envie o header:

```http
Authorization: Bearer <token>
```

## Endpoints

## Estado Atual de Protecao das Rotas

O projeto nao aplica autenticacao e autorizacao de forma uniforme. Hoje, o comportamento observado no codigo e:

| Grupo | Protecao atual | Observacao |
| --- | --- | --- |
| `/auth/*` | publica | login disponivel sem token |
| `/usuarios/*` | JWT obrigatorio | inclusive para criar usuario |
| `/produto/*` | middleware de role `Fiscal` | depende de `req.usuarioId`, mas o router nao aplica `autenticado` antes |
| `/role/*` | publica | sem middleware |
| `/permissao/*` | publica | sem middleware |
| `/seguranca/*` | publica | `acl` depende de `req.usuarioId`, mas o router nao aplica `autenticado` |

### Auth

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/auth/login` | Autentica usuario e retorna JWT |

### Usuarios

Rotas com middleware de autenticacao aplicado no router.

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/usuarios` | Cadastra usuario |
| `GET` | `/usuarios` | Lista usuarios |
| `GET` | `/usuarios/id/:id` | Busca usuario por ID |
| `PUT` | `/usuarios/id/:id` | Atualiza nome e email |
| `DELETE` | `/usuarios/id/:id` | Remove usuario |

Payload de cadastro:

```json
{
  "nome": "Maria Silva",
  "email": "maria@empresa.com",
  "senha": "123456"
}
```

### Produtos

Comportamento atual importante:

- o router exige role `Fiscal`
- o router nao aplica o middleware `autenticado` antes da verificacao de role
- na pratica, a rota depende de contexto de usuario que nao e inicializado nesse router

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/produto` | Cadastra produto |
| `GET` | `/produto` | Lista produtos |
| `GET` | `/produto/id/:id` | Busca produto por ID |
| `PUT` | `/produto/id/:id` | Atualiza produto |
| `DELETE` | `/produto/id/:id` | Remove produto |

Payload de exemplo:

```json
{
  "nome": "Notebook",
  "descricao": "Notebook corporativo",
  "preco": 4999.9
}
```

### Roles

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/role` | Cadastra role |
| `GET` | `/role` | Lista roles |
| `GET` | `/role/:id` | Busca role por ID |
| `PUT` | `/role/:id` | Atualiza role |
| `DELETE` | `/role/:id` | Remove role |

Payload de exemplo:

```json
{
  "nome": "admin",
  "descricao": "Perfil administrativo"
}
```

### Permissoes

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/permissao` | Cadastra permissao |
| `GET` | `/permissao` | Lista permissoes |
| `GET` | `/permissao/:id` | Busca permissao por ID |
| `PUT` | `/permissao/:id` | Atualiza permissao |
| `DELETE` | `/permissao/:id` | Remove permissao |

Payload de exemplo:

```json
{
  "nome": "produto:criar",
  "descricao": "Permite criar produtos"
}
```

### Seguranca / ACL

| Metodo | Rota | Descricao |
| --- | --- | --- |
| `POST` | `/seguranca/acl` | Substitui roles e permissoes do usuario autenticado |
| `POST` | `/seguranca/permissaoes-roles` | Substitui permissoes vinculadas a uma role |

Payload esperado:

```json
{
  "role": [
    "uuid-role-1",
    "uuid-role-2"
  ],
  "permissao": [
    "uuid-permissao-1",
    "uuid-permissao-2"
  ]
}
```

Comportamento atual:

- busca o usuario autenticado a partir de `req.usuarioId`
- remove todas as roles e permissoes ja associadas ao usuario
- associa os novos itens enviados no payload

Payload esperado para vinculo `role -> permissoes`:

```json
{
  "roleId": "uuid-role",
  "permissao": [
    "uuid-permissao-1",
    "uuid-permissao-2"
  ]
}
```

Observacao importante:

- a rota esta implementada como `/seguranca/permissaoes-roles`
- o nome possui inconsistencia ortografica e deveria ser padronizado antes de uma publicacao externa da API

## Exemplo de Fluxo de Uso

1. Autenticar via `POST /auth/login`
2. Usar o token JWT nas rotas protegidas
3. Criar roles e permissoes
4. Associar roles e permissoes ao usuario em `POST /seguranca/acl`
5. Consumir os recursos da API

## Tratamento de Erros

O projeto retorna mensagens simples em JSON ou texto puro, dependendo do controller. Os codigos mais usados sao:

- `200`: operacao realizada com sucesso
- `201`: recurso criado
- `400`: erro de validacao ou processamento
- `401`: autenticacao ausente ou falha de autorizacao
- `404`: falha de login por usuario nao encontrado

## Limitacoes Atuais

- nao existe rota publica para bootstrap do primeiro usuario
- nao existe validacao formal de payloads
- o segredo JWT esta versionado em arquivo
- a protecao por middleware nao esta aplicada de forma uniforme entre os routers
- a rota de produtos depende de role, mas nao inicializa autenticacao no proprio router
- o endpoint de seguranca para `acl` depende de `req.usuarioId`, embora o router nao aplique autenticacao
- existe inconsistencia de nomenclatura em `/seguranca/permissaoes-roles`
- nao ha suite de testes automatizados
- nao ha documentacao OpenAPI/Swagger

## Qualidade Tecnica

O projeto demonstra uma separacao razoavel entre controllers, services e models, com uso correto de hash de senha e tokens JWT. Ao mesmo tempo, existem pontos estruturais que precisam de evolucao para uso em ambientes mais exigentes.

Uma avaliacao tecnica objetiva, com riscos e recomendacoes atualizados, esta em [docs/AVALIACAO_TECNICA_ATUALIZADA.md](docs/AVALIACAO_TECNICA_ATUALIZADA.md).

## Estrutura do Projeto

```text
api/
  config/
  controllers/
  database/
  migrations/
  middleware/
  models/
  routes/
  services/
```

## Melhorias Recomendadas

- permitir bootstrap seguro do primeiro usuario administrador
- mover segredo JWT e configuracoes sensiveis para variaveis de ambiente
- padronizar middleware de autenticacao e autorizacao em todas as rotas sensiveis
- aplicar `autenticado` antes de `roles(["Fiscal"])` no router de produtos
- implementar validacao de entrada com `zod`, `joi` ou `express-validator`
- corrigir inconsistencias de modelagem nas tabelas de associacao
- renomear `/seguranca/permissaoes-roles` para uma rota consistente
- adicionar testes unitarios e de integracao
- publicar especificacao OpenAPI

## Autor

- Kennedy Francisco
