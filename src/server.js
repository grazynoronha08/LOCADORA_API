import express from "express";
import { Sequelize } from "sequelize";
import config from "./config/database.js";
import routes from "./routes.js"; 
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Rental from "./models/Rental.js";

const app = express();
app.use(express.json());

const sequelize = new Sequelize(config);

const models = [User, Vehicle, Rental];

models.forEach(model => model.init(sequelize));

models.forEach(model => {
    if (model.associate) {
        model.associate(sequelize.models);
    }
});

app.use(routes);

sequelize.authenticate().then(() => {
    console.log("Banco de dados Conectado");
    app.listen(3000, () => console.log("Server ON"));
}).catch(err => {
    console.error(err);
});