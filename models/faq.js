"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class FAQ extends Model {
    static associate(models) {
      // define association here
    }
  }
  FAQ.init(
    {
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "FAQ",
    },
  );
  return FAQ;
};
