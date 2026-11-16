# API de Locadora de Veículos

Esta é uma API RESTful para gerenciamento de frota e sistema de aluguel de carros. O projeto foi desenvolvido com Node.js, Express e PostgreSQL, focando em regras de negócio como controle de acesso por níveis (Administrador e Cliente), autenticação segura via JWT, atualização automática da disponibilidade dos veículos, contratação de seguros e pagamentos integrais ou divididos.

**Painel Interativo de Testes (Front-end):** [https://locadora-api-k59p.onrender.com](https://locadora-api-k59p.onrender.com)  
**Documentação Swagger:** [https://locadora-api-k59p.onrender.com/api-docs](https://locadora-api-k59p.onrender.com/api-docs)

---

## Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL (Neon / Render), Sequelize (ORM)
- **Segurança:** JWT (JSON Web Token), Bcrypt, CORS
- **Documentação & Testes:** Painel Web Interativo (`index.html`), Swagger UI, Postman

---

## Como testar a API na Nuvem (Recomendado)

Você pode testar todas as **26 rotas** diretamente pelo navegador sem precisar configurar nada na sua máquina:

1. **Pelo Painel Visual Interativo:** Acesse [https://locadora-api-k59p.onrender.com](https://locadora-api-k59p.onrender.com), utilize os botões de **Login Rápido** no topo (`grazy@admin.br` para Administradora ou `renan@locadora.com` para Cliente — senha padrão `123456`) e navegue pelas abas para testar cada funcionalidade.
2. **Pelo Swagger UI:** Acesse [https://locadora-api-k59p.onrender.com/api-docs](https://locadora-api-k59p.onrender.com/api-docs), clique em **Authorize**, cole o token JWT obtido no `/login` no formato `Bearer <seu_token>` e execute os endpoints.

---

## Como rodar o projeto localmente

### 1. Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) e o [PostgreSQL](https://www.postgresql.org/) instalados e rodando na sua máquina.

### 2. Instalação
Clone o repositório e instale as dependências:

```bash
git clone [https://github.com/grazynoronha08/LOCADORA_API.git](https://github.com/grazynoronha08/LOCADORA_API.git)
cd LOCADORA_API
npm install
```

### 3. Configuração do Banco de Dados
No seu painel do PostgreSQL local (ou via Beekeeper Studio / pgAdmin), crie um banco de dados chamado `usersdb`.  
Confira as credenciais ou variáveis de ambiente em `src/config/database.js`.

### 4. Executando as Migrations e Seeders
Para estruturar as 5 tabelas (`users`, `vehicles`, `rentals`, `payments`, `insurances`) no banco de dados, execute:

```bash
npx sequelize-cli db:migrate
```

*(Opcional)* Para popular o banco com usuários, veículos, aluguéis, pagamentos e seguros de exemplo:

```bash
npx sequelize-cli db:seed:all
```

### 5. Iniciando o servidor

```bash
node src/server.js
```

O servidor estará ativo em `http://localhost:3000` (painel web) e `http://localhost:3000/api-docs` (Swagger).

---

## Fluxo Detalhado para Testes (Painel Web, Swagger ou Postman)

> **Obs.:** Nas rotas protegidas via Postman ou Swagger, envie o token no cabeçalho `Authorization: Bearer <token>`. No painel web (`/`), o token é salvo e enviado automaticamente após o login.

### 1. Criar Administrador
- **Rota:** `POST /cadastro/administrador` *(Pública)*
- **Ação:** Cria uma conta com privilégios de administrador (`is_admin: true`).
- **Body (JSON):** Envie `name`, `age`, `email` e `password`.

### 2. Criar Cliente
- **Rota:** `POST /cadastro/cliente` *(Pública)*
- **Ação:** Cria um usuário comum no sistema (`is_admin: false`).
- **Body (JSON):** Envie `name`, `age`, `email` e `password`.

### 3. Autenticação (Login)
- **Rota:** `POST /login` *(Pública)*
- **Body (JSON):** Envie `email` e `password`.
- **Ação:** Valida as credenciais e retorna um Token JWT.

### 4. Gerenciar Veículos
- **Ver Veículos (Público):**
  - `GET /veiculos/todos`: Lista toda a frota cadastrada.
  - `GET /buscar/:identificador`: Busca um veículo específico pelo ID.
  - `GET /veiculos/busca?termo=`: Pesquisa veículos por marca ou modelo (`iLike`) e retorna o total de locações de cada veículo (`COUNT` com `GROUP BY`).
- **Modificar Veículos (Exige Token de Admin):**
  - `POST /veiculos`: Cadastra novo veículo enviando `marca`, `modelo`, `ano`, `placa` e `valor` (status inicia como `disponível`).
  - `PUT /atualizar/:id`: Atualiza dados ou valor da diária de um veículo.
  - `DELETE /veiculos/deletar/:id`: Remove um veículo da frota.

### 5. Realizar Aluguel
- **Rota:** `POST /alugar` *(Exige Token)*
- **Body (JSON):** Envie `usuario_id`, `veiculo_id`, `data_inicio` e `data_fim`.
- **Regras validadas:** Bloqueia a locação caso o `usuario_id` não corresponda ao usuário autenticado ou caso o veículo já esteja alugado. Ao concluir, o status do carro muda para `alugado`.

### 6. Listar e Cancelar Aluguéis
- **Listar Todos (Exige Token de Admin):** `GET /alugueis/todos` retorna o histórico completo de locações.
- **Cancelar Aluguel (Exige Token):** `DELETE /alugueis/cancelar/:id` permite que o cliente cancele o próprio aluguel ou que um Admin cancele qualquer reserva, retornando o veículo para `disponível`.

### 7. Contratar e Gerenciar Seguros
- **Contratar Seguro (Exige Token — Dono do aluguel ou Admin):** `POST /seguros` enviando `aluguel_id`, `tipo_seguro` (ex.: `Completo`, `Terceiros`, `Vidros e Roubo`, `Básico`) e `valor`. Cria a apólice com status `ativo`.
- **Consultar Seguro (Exige Token — Dono ou Admin):** `GET /seguros/:identificador` exibe os detalhes de uma apólice pelo ID.
- **Editar Seguro (Exige Token de Admin):** `PUT /seguros/:id` atualiza tipo, valor ou status do seguro.
- **Cancelar Seguro (Exige Token de Admin):** `PATCH /seguros/cancelar/:id` altera o status da apólice para `inativo`.
- **Relatórios de Seguros (Exige Token de Admin):**
  - `GET /seguro/relatorio`: Retorna a quantidade total de seguros ativos (`COUNT`).
  - `GET /seguro/relatorio/tipos`: Agrupa os seguros ativos por `tipo_seguro` (`GROUP BY`), exibindo contagem, soma total, menor e maior valor (`COUNT`, `SUM`, `MIN`, `MAX`).

### 8. Registrar Pagamentos (Integrais ou Divididos)
- **Registrar Pagamento (Exige Token — Dono do aluguel ou Admin):** `POST /pagamentos` enviando `rental_id`, `valor`, `data` e `metodo_pagamento` (`PIX`, `Cartão de Crédito`, `Cartão de Débito` ou `Dinheiro`).
- **Regras financeiras:**
  - Calcula automaticamente o valor total do contrato somando `(dias × diária do veículo) + seguros ativos` vinculados ao aluguel.
  - Permite dividir o pagamento de um mesmo aluguel em **duas ou mais formas diferentes** (ex.: parte em Dinheiro e parte no Cartão).
  - Bloqueia lançamentos acima do saldo devedor ou em aluguéis já quitados, retornando o `resumo_financeiro` atualizado.
- **Consultas, Edição e Estorno:**
  - `GET /pagamentos/:id` *(Dono do aluguel ou Admin)*: Busca um pagamento específico.
  - `GET /pagamentos/todos` *(Admin)*: Lista todos os pagamentos registrados.
  - `PUT /pagamentos/:id` e `DELETE /pagamentos/:id` *(Admin)*: Atualiza ou remove um lançamento financeiro.
  - `GET /pagamentos/relatorio` *(Admin)*: Executa consulta SQL com `INNER JOIN` cruzando `payments` e `rentals` ordenados pela data mais recente.

### 9. Gestão de Usuários
- **Listar Usuários (Exige Token de Admin):** `GET /usuarios/todos` retorna todos os usuários cadastrados.
- **Remover Usuário (Exige Token):** `DELETE /usuarios/deletar/:id` permite que um cliente exclua a própria conta ou que um Admin remova qualquer conta.