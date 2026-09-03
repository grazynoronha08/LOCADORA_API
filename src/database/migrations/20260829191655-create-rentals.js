'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rentals', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      usuario_id: {
        type: Sequelize.UUID, 
        allowNull: false,
        references: { model: 'users', key: 'id' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      veiculo_id: {
        type: Sequelize.UUID, 
        allowNull: false,
        references: { model: 'vehicles', key: 'id' }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_inicio: {
        type: Sequelize.DATE,
        allowNull: false, 
      },
      data_fim: {
        type: Sequelize.DATE,
        allowNull: false, 
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('rentals');
  },
};