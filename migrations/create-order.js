'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            OrderID: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            CustomerID: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Customers',
                    key: 'CustomerID'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            OrderDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            Status: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    }
};