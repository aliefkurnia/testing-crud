import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Menggunakan modal dari react-modal
import "./AddUserPage.css";

// Mengatur elemen root untuk modal
Modal.setAppElement("#root");

const AddUserPage = ({ isOpen, onClose, onUserAdded, userToEdit }) => {
  const [userData, setUserData] = useState({
    name: "",
    gender: "",
    age: "",
    username: "",
    password: "",
    address: "", // Menambahkan field alamat
  });

  const [loading, setLoading] = useState(false); // State untuk loading
  const [error, setError] = useState(""); // State untuk error message
  const [passwordVisible, setPasswordVisible] = useState(false); // State untuk mengatur visibilitas password

  // Reset form ketika modal dibuka, atau set nilai default untuk edit
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setUserData({
          name: userToEdit.name || "",
          gender: userToEdit.gender || "",
          age: userToEdit.age || "",
          username: userToEdit.username || "",
          password: userToEdit.password || "",
          address: userToEdit.address || "",
        });
      } else {
        setUserData({
          name: "",
          gender: "",
          age: "",
          username: "",
          password: "",
          address: "",
        });
      }
      setError(""); // Reset error message
    }
  }, [isOpen, userToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true ketika proses pengiriman dimulai
    setError(""); // Reset error message

    try {
      const url = userToEdit
        ? `http://localhost:3000/users/${userToEdit.id}`
        : "http://localhost:3000/users";
      const method = userToEdit ? "PUT" : "POST"; // Gunakan PUT jika edit, POST jika baru

      // Kirim data ke server
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Gagal menambahkan atau mengedit pengguna");
      }
      onUserAdded();
      onClose(); // Menutup modal setelah data berhasil disubmit
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      setError(
        "Terjadi kesalahan saat menambahkan atau mengedit pengguna. Silakan coba lagi."
      ); // Tampilkan pesan error
    } finally {
      setLoading(false); // Set loading false setelah proses selesai
    }
  };
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
      closeTimeoutMS={300} // Menambahkan waktu transisi untuk menutup modal
    >
      <div className="add-user-page-container">
        <h2>{userToEdit ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h2>
        <form onSubmit={handleSubmit} className="add-user-form">
          {error && <div className="error-message">{error}</div>}{" "}
          {/* Menampilkan error jika ada */}
          <div className="input-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="gender">Jenis Kelamin</label>
            <select
              id="gender"
              name="gender"
              value={userData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="age">Usia</label>
            <input
              type="number"
              id="age"
              name="age"
              value={userData.age}
              onChange={handleInputChange}
              placeholder="Masukkan usia"
              min="1" // Membatasi usia minimal 1
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="address">Alamat</label>
            <textarea
              id="address"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              placeholder="Masukkan alamat"
              required
            />
          </div>
          <div className="username-password-container">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Kata Sandi</label>
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={userData.password}
                onChange={handleInputChange}
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                className="password-reveal-btn"
                onClick={togglePasswordVisibility}
              >
                <i
                  className={`fas ${
                    passwordVisible ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? "Menambahkan..."
                : userToEdit
                ? "Perbarui Pengguna"
                : "Tambah Pengguna"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Batal
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUserPage;
