"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Menambahkan asosiasi dengan User (Order milik satu User)
      Order.belongsTo(models.User, {
        foreignKey: "user_id", // kolom yang menjadi foreign key di Order
        as: "user", // alias yang digunakan dalam query
      });
    }
  }
  Order.init(
    {
      user_id: DataTypes.INTEGER,
      order_date: DataTypes.DATE,
      total_amount: DataTypes.DECIMAL,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
