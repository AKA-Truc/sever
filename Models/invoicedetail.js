'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class InvoiceDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define the relationship between InvoiceDetail and Invoice
            InvoiceDetail.belongsTo(models.Invoice, {
                foreignKey: 'InvoiceID',
                as: 'invoice'
            });

            // Define the relationship between InvoiceDetail and Product
            InvoiceDetail.belongsTo(models.Product, {
                foreignKey: 'ProductID',
                as: 'product'
            });
        }
    }
    InvoiceDetail.init({
        InvoiceID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
    }, {
        sequelize,
        modelName: 'InvoiceDetail',
        tableName: 'Invoicedetails',
        timestamps: false,
    });
    return InvoiceDetail;
};