import React, { useEffect, useState } from "react";
import AddUserPage from "./AddUserPage"; // Import AddUserPage modal
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk kontrol modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State untuk menyimpan data pengguna yang sedang diedit
  const [userToEdit, setUserToEdit] = useState(null);

  // Fungsi untuk membuka modal
  const openModal = () => setIsModalOpen(true);

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null); // Reset data setelah modal ditutup
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleEdit = (id) => {
    // Mencari pengguna berdasarkan id dan set ke userToEdit
    const user = users.find((user) => user.id === id);
    setUserToEdit(user);
    openModal(); // Buka modal saat memilih edit
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h1>User List</h1>
      <div>
        <button className="add-user-btn" onClick={openModal}>
          Add New User
        </button>
        {/* Pass fetchUsers dan userToEdit sebagai prop ke AddUserPage */}
        <AddUserPage
          isOpen={isModalOpen}
          onClose={closeModal}
          onUserAdded={fetchUsers} // Memanggil fetchUsers setelah data ditambahkan
          userToEdit={userToEdit} // Pass user yang akan diedit
        />
      </div>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-info">
              <img
                src={`https://api.adorable.io/avatars/50/${user.name}.png`}
                alt="User Avatar"
                className="user-avatar"
              />
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p>Gender: {user.gender}</p>
                <p>Age: {user.age}</p>
                <p>Address: {user.address}</p>
              </div>
            </div>
            <div className="user-actions">
              <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
