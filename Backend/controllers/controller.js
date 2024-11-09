const { User, Order, sequelize } = require("../models"); // Pastikan sequelize diimpor juga jika diperlukan

class Controller {
  static async getAllUsersWithOrders(req, res) {
    try {
      const users = await User.findAll({
        include: {
          model: Order,
          as: "orders",
          attributes: ["id", "order_date", "total_amount", "status"],
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  static async getUserWithOrdersById(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findOne({
        where: { id: userId },
        include: {
          model: Order,
          as: "orders",
          attributes: ["id", "order_date", "total_amount", "status"],
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  static async createUserWithOrders(req, res) {
    const { name, gender, age, address, username, password, orders } = req.body; // tambahkan address

    try {
      // Validasi input, jika perlu
      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const newUser = await User.create({
        name,
        gender,
        age,
        address, // tambahkan address
        username,
        password,
      });

      if (orders && orders.length > 0) {
        const ordersData = orders.map((order) => ({
          user_id: newUser.id,
          order_date: order.order_date,
          total_amount: order.total_amount,
          status: order.status,
        }));

        await Order.bulkCreate(ordersData);
      }

      res.status(201).json({
        message: "User and orders created successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  static async updateUserWithOrders(req, res) {
    const userId = req.params.id;
    const { name, gender, age, address, password, orders } = req.body; // tambahkan password

    try {
      // Ambil User beserta Orders terkait
      const user = await User.findByPk(userId, {
        include: [{ model: Order, as: "orders" }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      user.name = name || user.name;
      user.gender = gender || user.gender;
      user.age = age || user.age;
      user.address = address || user.address;
      if (password) {
        user.password = password; // update password jika ada
      }
      await user.save();

      // Update atau tambah pesanan
      if (orders && orders.length > 0) {
        for (const order of orders) {
          const orderData = {
            user_id: user.id,
            order_date: order.order_date,
            total_amount: order.total_amount,
            status: order.status,
          };

          if (order.id) {
            // Jika id ada, update order
            await Order.update(orderData, {
              where: { id: order.id, user_id: user.id },
            });
          } else {
            // Jika id tidak ada, buat order baru
            await Order.create(orderData);
          }
        }
      }

      // Ambil ulang data User beserta pesanan
      const updatedUser = await User.findByPk(userId, {
        include: [{ model: Order, as: "orders" }],
      });

      // Kirim response
      res.status(200).json({
        message: "User and orders updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  static async deleteUserWithOrders(req, res) {
    const userId = req.params.id;
    const transaction = await sequelize.transaction();

    try {
      // First delete all orders for the user in a transaction
      await Order.destroy({
        where: { user_id: userId },
        transaction,
      });

      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Then delete the user
      await user.destroy({ transaction });

      await transaction.commit();

      res.status(200).json({
        message: "User and associated orders deleted successfully",
      });
    } catch (error) {
      await transaction.rollback(); // Rollback transaction in case of error
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }

  static async addOrderById(req, res) {
    const userId = req.params.id;
    const { order_date, total_amount, status } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newOrder = await Order.create({
        user_id: user.id,
        order_date,
        total_amount,
        status,
      });

      res.status(201).json({
        message: "Order added successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  }
}

module.exports = Controller;
