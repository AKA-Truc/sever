'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vouchers', {
      VoucherID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Describes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Percent: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Mincost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      Maxcost: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      EXDate: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vouchers');
  }
};