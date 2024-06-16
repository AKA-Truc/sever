'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Invoices', {
          InvoiceID: {
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },
          OrderID: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false,
            references: {
              model: 'Orders', 
              key: 'OrderID'
            }
          },
          InvoiceDate: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          Totalcost: {
            type: Sequelize.INTEGER,
            allowNull: false,
          }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Invoices');
    }
};