import Sequelize, { Model } from 'sequelize';

class Vehicle extends Model {
    static init(sequelize) {
        super.init(
            {
                marca: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                ano: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                modelo: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                placa: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: true,
                },
                valor: {
                    type: Sequelize.FLOAT,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: 'disponível',
                },
            },


            { sequelize })
    }
}
export default Vehicle