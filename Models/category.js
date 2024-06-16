'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.hasMany(models.Product, { foreignKey: 'CategoryID' });
        }
    }
    Category.init({
        CategoryID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        Name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'Categories',
        timestamps: false,
    });
    return Category;
};