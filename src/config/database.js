import { underscoredIf } from "sequelize/lib/utils";

export default{
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: '8108',
    database: 'usersdb',
    define: {
        timestamp: true,
        underscored: true,
        underscoredAll: true,
    }

}