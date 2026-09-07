import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Locadora API',
    description: 'Documentação da API de Gestão e Aluguel de Veículos'
  },
  host: 'locadora-api-k59p.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes.js']; // Lendo as suas rotas automaticamente

swaggerAutogen()(outputFile, endpointsFiles, doc);