'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.belongsTo(models.Category, { foreignKey: 'CategoryID' });
        }
    }
    Product.init({
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        CategoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'CategoryID'
            }
        },
        Name: DataTypes.STRING,
        Brand: DataTypes.STRING,
        Description: DataTypes.STRING, 
        Volume: DataTypes.INTEGER,
        Price: DataTypes.INTEGER,
        image: DataTypes.TEXT,
        Inventory: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Product',
        timestamps: false,
    });
    return Product;
};