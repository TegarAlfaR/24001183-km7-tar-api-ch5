'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auth extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Auth.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
  }
  Auth.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
        validate: {
          len: [8, 100]
        }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'Auth',
  });
  return Auth;
};