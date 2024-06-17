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
            Invoice.hasMany(models.InvoiceDetail, { 
                as: 'InvoiceDetail', 
                foreignKey: 'InvoiceID' 
            });
            Invoice.belongsTo(models.Customer, { 
                as: 'Customer', 
                foreignKey: 'CustomerID' 
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
        OrderID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Order',
                key: 'OrderID'
            }
        },
        CustomerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Customer',
                key: 'CustomerID'
            }
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