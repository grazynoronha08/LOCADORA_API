const configuracaoLocal = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: '8108',
  database: 'usersdb',
  define: {
    timestamps: true,
    underscored: true,
  }
};

const configuracaoNuvem = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  dialectOptions: {
    ssl: false // Desativado pois a rede interna do Render não exige
  }
};

// Define qual usar com base no ambiente (Nuvem ou PC)
const ambienteAtual = process.env.DATABASE_URL ? configuracaoNuvem : configuracaoLocal;

// Exporta de um formato híbrido que o Sequelize CLI e a sua API conseguem ler perfeitamente
module.exports = {
  development: configuracaoLocal,
  production: configuracaoNuvem,
  ...ambienteAtual
};