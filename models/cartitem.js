// models/cartItem.js

"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    static associate(models) {
      // 定義與 Cart 的關聯
      CartItem.belongsTo(models.Cart, {
        foreignKey: "cartId",
        as: "cart",
      });

      // 定義與 Product 的關聯
      CartItem.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  CartItem.init(
    {
      cartId: DataTypes.INTEGER,
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );
  return CartItem;
};
