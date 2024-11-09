const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

// Mendapatkan semua user beserta orders mereka
router.get("/users", Controller.getAllUsersWithOrders);

// Mendapatkan user tertentu beserta orders berdasarkan id
router.get("/users/:id", Controller.getUserWithOrdersById);

// Menambahkan user baru beserta orders (jika ada)
router.post("/users", Controller.createUserWithOrders);

// Memperbarui data user beserta orders mereka
router.put("/users/:id", Controller.updateUserWithOrders);

// Menghapus user beserta orders mereka
router.delete("/users/:id", Controller.deleteUserWithOrders);

// Menambahkan order untuk user berdasarkan id
router.post("/users/:id/orders", Controller.addOrderById);

module.exports = router;
