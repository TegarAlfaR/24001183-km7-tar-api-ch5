'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Auth, { foreignKey: 'user_id', as: 'auth' })
      User.hasMany(models.Car, { foreignKey: 'created_by', as: 'carsCreated' });
      User.hasMany(models.Car, { foreignKey: 'updated_by', as: 'carsUpdated' });
      User.hasMany(models.Car, { foreignKey: 'deleted_by', as: 'carsDeleted' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        len: [3, 50]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1
      },
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'member'
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};