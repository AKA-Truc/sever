'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {

        }
    }
    Voucher.init({
        VoucherID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        Name: DataTypes.STRING,
        Describes: DataTypes.STRING,
        Percent: DataTypes.INTEGER,
        Mincost: DataTypes.INTEGER,
        Maxcost: DataTypes.INTEGER,
        EXDate: DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'Voucher',
        timestamps: false,
    });
    return Voucher;
};