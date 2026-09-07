import express from "express";
import { Sequelize } from "sequelize";
import config from "./config/database.js";
import routes from "./routes.js"; 
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Rental from "./models/Rental.js";
import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('../swagger-output.json');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚗 Locadora API online! Acesse /api-docs para ver a documentação.');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const sequelize = new Sequelize(config);
const models = [User, Vehicle, Rental];

models.forEach(model => model.init(sequelize));

models.forEach(model => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
});

app.use(routes);

const PORT = process.env.PORT || 3000;


sequelize.authenticate().then(() => {
    console.log("Banco de dados Conectado");
    app.listen(PORT, () => console.log("Server ON"));
}).catch(err => {
    console.error("Erro ao conectar no banco:", err);
});