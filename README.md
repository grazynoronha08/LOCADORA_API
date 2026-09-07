# API de Locadora de Veículos

Esta é uma API RESTful para gerenciamento de frota e sistema de aluguel de carros. O projeto foi desenvolvido com Node.js e PostgreSQL, focando em regras de negócio como controle de acesso por níveis (Administrador e Cliente), autenticação segura e atualização automática da disponibilidade dos veículos.

**Acesse a API Online:** [https://locadora-api-k59p.onrender.com](https://locadora-api-k59p.onrender.com)  
**Documentação Swagger:** [https://locadora-api-k59p.onrender.com/api-docs](https://locadora-api-k59p.onrender.com/api-docs)

## Tecnologias Utilizadas

* **Backend:** Node.js, Express.js
* **Banco de Dados:** PostgreSQL (Render), Sequelize (ORM)
* **Segurança:** JWT (JSON Web Token), Bcrypt
* **Documentação:** Swagger
* **Outros:** Crypto (Geração de UUIDs)

## Como testar a API na Nuvem (Recomendado)

Acesse o link da **Documentação Swagger** acima. Por lá, você pode visualizar todas as rotas e testá-las diretamente pelo navegador, sem precisar configurar o banco de dados na sua máquina.

## Como rodar o projeto localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) e o [PostgreSQL](https://www.postgresql.org/) instalados e rodando na sua máquina.

### 2. Instalação
Clone o repositório e instale as dependências:

git clone [https://github.com/grazynoronha08/LOCADORA_API.git](https://github.com/grazynoronha08/LOCADORA_API.git)
cd LOCADORA_API

Dependências:

O comando padrão npm install já baixa todas as bibliotecas automaticamente, mas os pacotes base utilizados no projeto foram instalados com:

```
npm install --save sequelize
npm install --save pg pg-hstore  
npm install sequelize-cli --dev
npm install bcrypt
```

### 3. Configuração do Banco de Dados

No seu painel do PostgreSQL local, crie um banco de dados em branco chamado `usersdb`.
O sistema já está configurado no arquivo `src/config/database.js` para usar a porta padrão e a senha `8108` no ambiente local.

### 4. Executando as Migrations

Para estruturar as tabelas (`users`, `vehicles`, `rentals`) no banco de dados, rode o comando:

npx sequelize-cli db:migrate

### 5. Iniciando o servidor

Com o banco configurado, inicie a aplicação:

node src/server.js


O servidor estará ativo em `http://localhost:3000`.


## Fluxo Detalhado para Testes (Postman)

** Obs:** O arquivo da Collection anexado a este repositório (`postman/collections/...`) já contém exemplos preenchidos no Body para cada uma das ações abaixo. Nas rotas protegidas, lembre-se de colar o token na aba **Authorization > Bearer Token**.

Siga esta ordem para validar todas as regras de negócio da API:

**1. Criar Administrador**

* **Rota:** `POST /cadastro/administrador`
* **Ação:** O sistema cria a conta com privilégios de administrador automaticamente.
* **Body (JSON):** Envie `name`, `age`, `email` e `password`.

**2. Criar Cliente**

* **Rota:** `POST /cadastro/cliente`
* **Ação:** Cria um usuário comum no sistema.
* **Body (JSON):** Envie `name`, `age`, `email` e `password`.

**3. Autenticação - Login**

* **Rota:** `POST /login`
* **Body (JSON):** Envie o `email` e `password`.
* **Ação:** O sistema validará as credenciais e retornará um Token JWT. **Copie este Token para usar nos próximos passos.**

**4. Gerenciar Veículos**

* **Ver Veículos:** Qualquer pessoa pode ver a lista de veículos (`GET /veiculos/todos`) ou buscar um veículo específico (`GET /buscar/:identificador`).
* **Modificar Veículos (Exige Token de Admin):** Insira o Token de Administrador na aba *Authorization* para cadastrar (`POST /veiculos`), atualizar (`PUT /atualizar/:id`) ou remover (`DELETE /veiculos/deletar/:id`) veículos do sistema.
* **Body de Cadastro:** Envie `marca`, `ano`, `modelo`, `placa` e `valor`. O status será `disponível` por padrão.

**5. Realizar Aluguel (Exige Token)**

* **Rota:** `POST /alugar`
* **Ação:** Insira um Token de Administrador ou Cliente na aba *Authorization* para cadastrar.
* **Body (JSON):** Envie `usuario_id`, `veiculo_id`, `data_inicio` e `data_fim`.
* **Regras validadas:** O sistema bloqueia a locação se o ID do JSON for diferente do dono do Token logado, ou se o veículo já estiver alugado. Em caso de sucesso, o status do carro muda para `alugado`.

**6. Listar e Cancelar Aluguéis**

* **Listar (Exige Token de Admin):** Acesse `GET /alugueis/todos` com credenciais de administrador para ver o histórico completo.
* **Cancelar (Exige Token):** Acesse `DELETE /alugueis/cancelar/:id`. Um cliente só pode cancelar o próprio aluguel, enquanto um Admin pode cancelar qualquer um. O veículo volta a ficar `disponível` automaticamente.

**7. Gestão de Usuários (Exige Token)**

* **Listar Usuários:** Apenas Administradores podem acessar a rota `GET /usuarios/todos`.
* **Remover Usuário:** Na rota `DELETE /usuarios/deletar/:id`, um usuário comum só pode deletar a própria conta, mas um Admin pode remover outras contas.