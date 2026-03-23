# 📦 API de Autenticação, Usuários e Controle de Acesso (ACL)

API REST desenvolvida com Node.js para gerenciamento de autenticação, usuários, roles e permissões, implementando controle de acesso baseado em ACL (*Access Control List*).

---

## 🚀 Sobre o Projeto

Esta API foi construída com foco em **segurança, organização em camadas e controle de acesso granular**, permitindo:

- Autenticação via JWT
- Gerenciamento completo de usuários
- Controle de acesso por **roles** e **permissões**
- Associação direta de permissões a usuários (ACL)
- Estrutura preparada para evolução em ambientes reais

---

## 🛠️ Stack Tecnológica

- **Node.js** 18
- **Express** 4
- **Sequelize** 6
- **SQLite** (desenvolvimento)
- **JWT (`jsonwebtoken`)**
- **bcryptjs** (hash de senha)

---

## 🧱 Arquitetura

O projeto segue o padrão de separação em camadas:

```
api/
  config/        # Configurações (DB, JWT)
  controllers/   # Camada HTTP (req/res)
  services/      # Regras de negócio
  models/        # Models e associações Sequelize
  migrations/    # Estrutura do banco
  middleware/    # Autenticação e autorização
  routes/        # Definição de endpoints
  index.js       # Bootstrap da aplicação
```

---

## 🧩 Modelagem do Domínio

### 👤 Usuário
- `id` (UUID)
- `nome`
- `email`
- `senha`

> ⚠️ A senha é ocultada automaticamente via `defaultScope`.

---

### 📦 Produto
- `id`
- `nome`
- `descricao`
- `preco`

---

### 🛡️ Role
- `id`
- `nome`
- `descricao`

---

### 🔑 Permissão
- `id`
- `nome`
- `descricao`

---

### 🔗 Relacionamentos

- Usuários ⇄ Roles (N:N)
- Usuários ⇄ Permissões (N:N)
- Roles ⇄ Permissões (N:N)

---

## ⚙️ Instalação e Execução

```bash
npm install
npm start
```

Servidor:

```
http://localhost:3000
```

---

## 🗄️ Banco de Dados

| Ambiente     | Banco        |
|--------------|-------------|
| development  | SQLite       |

Executar migrations:

```bash
npx sequelize-cli db:migrate
```

---

## 🔐 Autenticação

### Login

```http
POST /auth/login
```

**Request**
```json
{
  "email": "usuario@empresa.com",
  "senha": "123456"
}
```

**Response**
```json
{
  "accessToken": "jwt-token"
}
```

---

### Uso do Token

```http
Authorization: Bearer <token>
```

---

## 📡 Endpoints

### 🔑 Auth

| Método | Rota | Descrição |
|------|------|--------|
| POST | `/auth/login` | Autentica usuário |

---

### 👤 Usuários (🔒 protegidas)

| Método | Rota |
|------|------|
| POST | `/usuarios` |
| GET | `/usuarios` |
| GET | `/usuarios/id/:id` |
| PUT | `/usuarios/id/:id` |
| DELETE | `/usuarios/id/:id` |

---

### 📦 Produtos (⚠️ restrição por role)

| Método | Rota |
|------|------|
| POST | `/produto` |
| GET | `/produto` |
| GET | `/produto/id/:id` |
| PUT | `/produto/id/:id` |
| DELETE | `/produto/id/:id` |


---

### 🛡️ Roles

| Método | Rota |
|------|------|
| POST | `/role` |
| GET | `/role` |
| GET | `/role/:id` |
| PUT | `/role/:id` |
| DELETE | `/role/:id` |

---

### 🔑 Permissões

| Método | Rota |
|------|------|
| POST | `/permissao` |
| GET | `/permissao` |
| GET | `/permissao/:id` |
| PUT | `/permissao/:id` |
| DELETE | `/permissao/:id` |

---

### 🔐 Segurança / ACL

#### Atualizar ACL do usuário

```http
POST /seguranca/acl
```

```json
{
  "role": ["uuid-role"],
  "permissao": ["uuid-permissao"]
}
```

---

#### Vincular permissões a uma role

```http
POST /seguranca/permissaoes-roles
```

```json
{
  "roleId": "uuid-role",
  "permissao": ["uuid-permissao"]
}
```

> ⚠️ Endpoint possui inconsistência de nomenclatura (`permissaoes`)

---

## 🔄 Fluxo de Uso

1. Realizar login
2. Receber JWT
3. Criar roles e permissões
4. Associar ao usuário (ACL)
5. Consumir recursos protegidos

---

## ❗ Limitações Atuais

- ❌ Falta padronização de autenticação entre rotas
- ❌ Sem validação de payload
- ❌ JWT secret versionado no código
- ❌ Sem testes automatizados
- ❌ Sem documentação Swagger
- ❌ Inconsistência em nomes de endpoints
- ❌ Dependência de `req.usuarioId` sem garantir autenticação

---

## 📈 Melhorias Futuras

- ✅ Implementar validação (`Joi`, `Zod`)
- ✅ Padronizar middlewares de auth
- ✅ Uso de variáveis de ambiente (.env)
- ✅ Corrigir modelagem de relacionamentos
- ✅ Criar testes automatizados
- ✅ Adicionar Swagger/OpenAPI
- ✅ Corrigir naming (`permissaoes` → `permissoes`)
- ✅ Criar fluxo de bootstrap de admin

---

## 🧠 Avaliação Técnica

O projeto demonstra:

✔ Boa separação de responsabilidades  
✔ Uso correto de JWT e hash de senha  
✔ Modelagem inicial de ACL consistente  

Mas ainda precisa evoluir em:

- segurança
- padronização
- maturidade de produção

---

## 👨‍💻 Autor

**Kennedy Francisco**

---

## ⭐ Considerações Finais

Esse projeto já está em nível de portfólio intermediário para avançado.  
Com ajustes em segurança e padronização, pode facilmente atingir nível profissional.
