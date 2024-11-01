'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.belongsTo(models.User, { foreignKey: 'created_by', as: 'carsCreated' })
      Car.belongsTo(models.User, { foreignKey: 'updated_by', as: 'carsUpdated' })
      Car.belongsTo(models.User, { foreignKey: 'deleted_by', as: 'carsDeleted' })
    }
  }
  Car.init({
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    license_plate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 2000
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'available'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    deleted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Car',
  });
  return Car;
};