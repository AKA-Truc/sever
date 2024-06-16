'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            // Define the relationship between Invoice and Order
            Invoice.belongsTo(models.Order, {
                foreignKey: 'OrderID',
                as: 'Order'
            });
        }
    }
    Invoice.init({
        InvoiceID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        InvoiceDate: DataTypes.DATE,
        Totalcost: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Invoice',
        tableName: 'invoices',
        timestamps: false,
    });
    return Invoice;
};