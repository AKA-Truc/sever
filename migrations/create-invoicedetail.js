'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Invoicedetails', {
      InvoiceID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Invoices', // Make sure to reference the correct table name
          key: 'InvoiceID'
        },
        onUpdate: 'CASCADE', // Ensures referential integrity on update
        onDelete: 'CASCADE' // Ensures referential integrity on delete
      },
      ProductID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products', // Make sure to reference the correct table name
          key: 'ProductID'
        },
        onUpdate: 'CASCADE', // Ensures referential integrity on update
        onDelete: 'CASCADE' // Ensures referential integrity on delete
      },
      Quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Invoicedetails');
  }
};