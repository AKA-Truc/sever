'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Customer.hasMany(models.Order, { foreignKey: 'CustomerID', as: 'Orders' });
        }
    }
    Customer.init({
        CustomerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
      Name: DataTypes.STRING,
      Phone: DataTypes.STRING,
      Gender: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Customer',
        timestamps: false,
    });
    return Customer;
};
