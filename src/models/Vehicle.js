import Sequelize, { Model } from 'sequelize';

class Vehicle extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
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

    static associate(models) {
    this.hasMany(models.Rental, {foreignKey: 'veiculo_id', as: 'rentals',});
  }

}
export default Vehicle