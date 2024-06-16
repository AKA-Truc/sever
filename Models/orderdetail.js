'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    static associate(models) {
      // Định nghĩa mối quan hệ với Order và Product
      OrderDetail.belongsTo(models.Order, { foreignKey: 'OrderID', as: 'Order' });
      OrderDetail.hasOne(models.Product, { foreignKey: 'ProductID', as: 'Product' });
    }
  }

  OrderDetail.init({
    OrderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Order', // Tên bảng Orders trong database
        key: 'OrderID'
      }
    },
    ProductID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Product', // Tên bảng Products trong database
        key: 'ProductID'
      }
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'OrderDetail',
    tableName: 'OrderDetails', // Tên bảng trong database
    timestamps: false, // Không sử dụng timestamps
  });

  return OrderDetail;
};
