import Sequelize, { Model } from 'sequelize';

class Rental extends Model {
    static init(sequelize) {
        super.init(
            {
                data_inicio: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                data_fim: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
            },
            { sequelize }
        );
    }


    static associate(models) {
        // Um Aluguel pertence a um Usuário (Cliente)
        this.belongsTo(models.User, { foreignKey: 'usuario_id', as: 'cliente' });

        // Um Aluguel pertence a um Veículo
        this.belongsTo(models.Vehicle, { foreignKey: 'veiculo_id', as: 'veiculo' });
    }
}

export default Rental;