'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {
      PaymentMethod.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  };
  PaymentMethod.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('cash_on_delivery', 'credit_card'),
      allowNull: false
    },
    cardNumber: {
      type: DataTypes.STRING(16)
    },
    cardExpiry: {
      type: DataTypes.STRING(4)
    },
    cardCVV: {
      type: DataTypes.STRING(3)
    },
    cardHolderName: {
      type: DataTypes.STRING
    },
    billingAddress: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'PaymentMethod',
  });
  return PaymentMethod;
};
