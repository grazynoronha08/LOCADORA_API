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
  dialect: 'postgres',
  dialectOptions: {
    ssl: false 
  },
  define: {
    timestamps: true,
    underscored: true,
  }
};


if (process.env.DATABASE_URL) {
  const dbUrl = new URL(process.env.DATABASE_URL);
  configuracaoNuvem.host = dbUrl.hostname;
  configuracaoNuvem.port = dbUrl.port || 5432;
  configuracaoNuvem.username = dbUrl.username;
  configuracaoNuvem.password = dbUrl.password;
  configuracaoNuvem.database = dbUrl.pathname.replace('/', '');
}

const ambienteAtual = process.env.DATABASE_URL ? configuracaoNuvem : configuracaoLocal;

export default {
  ...ambienteAtual,
  development: ambienteAtual,
  test: ambienteAtual,
  production: ambienteAtual
};