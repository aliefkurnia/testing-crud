"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Menambahkan asosiasi dengan Order (User memiliki banyak Order)
      User.hasMany(models.Order, {
        foreignKey: "user_id", // kolom yang menjadi foreign key di Order
        as: "orders", // alias yang digunakan dalam query
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      gender: DataTypes.STRING,
      age: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
