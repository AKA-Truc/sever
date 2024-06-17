'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            // Define the relationship between Order and Invoice
            Order.hasOne(models.Invoice, {
                foreignKey: 'OrderID',
                as: 'Invoice'
            });

            // Define the relationship between Order and Customer (nếu cần)
            Order.belongsTo(models.Customer, {
                foreignKey: 'CustomerID',
                as: 'Customer'
            });

            Order.hasMany(models.OrderDetail, { 
                foreignKey: 'OrderID' ,
                as: 'OrderDetail'
            });
        }
    }
    Order.init({
        OrderID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        CustomerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        OrderDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Order',
        timestamps: false,
    });
    return Order;
};