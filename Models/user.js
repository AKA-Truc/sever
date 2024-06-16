'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here
      User.hasMany(models.Employee, { foreignKey: 'Phone', as: 'Employees'});
      // Example of association with another model (Post)
      // This assumes there is a Post model with a userId foreign key
    }
    isCorrectPassword(password) {
      return password = this.Password;
    }
  }
  
  User.init({
    Name: DataTypes.STRING,      
    Phone: DataTypes.STRING,
    Password: DataTypes.STRING,
    Role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,         
  });
  return User;
};
