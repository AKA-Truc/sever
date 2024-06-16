'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
          ProductID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          CategoryID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'CategoryID'
            }
          },
          Name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          Brand: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          Description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          Volume: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          Price: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          image: {
            type: Sequelize.TEXT('long')
          },
          Inventory: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    }
};