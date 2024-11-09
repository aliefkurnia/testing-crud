const express = require("express");
const app = express();
const route = require("./routes/route"); // Pastikan path ini benar
const cors = require("cors");

// Mengizinkan CORS untuk semua origin (front-end lain dapat mengakses API)
app.use(cors());

// Jika Anda ingin mengizinkan hanya origin tertentu (misalnya localhost:3001)
// app.use(cors({
//   origin: "http://localhost:3001" // Ganti dengan origin frontend Anda
// }));

app.use(express.json()); // Untuk parsing JSON request
app.use(express.urlencoded({ extended: false })); // Untuk parsing URL-encoded request

// Menggunakan router yang telah Anda buat
app.use(route);

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log("Server berjalan di http://localhost:3000");
});
