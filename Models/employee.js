'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Employee extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Employee.hasOne(models.User, { foreignKey: 'Phone', as: 'Users' });
        }
    }
    Employee.init({
        EmployeeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
      Name: DataTypes.STRING,
      Phone: DataTypes.STRING,
      Gender: DataTypes.STRING,
      Address:  DataTypes.STRING,
      Role: DataTypes.STRING,
      Salary: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Employee',
        timestamps: false,
    });
    return Employee;
};
