import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Userlist = ({ onEdit }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const itemsPerPage = 10; // Jumlah item per halaman
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/users');
      // Sort berdasarkan tanggal terbaru (createdAt descending)
      const sortedUsers = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        navigate('/', { replace: true });
        return;
      }
      setError(error.response?.data?.msg || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (uuid) => {
    const confirmation = window.confirm('Are you sure you want to delete this user?');
    if (!confirmation) return;

    try {
      await axios.delete(`/api/users/${uuid}`);
      getUsers(); // Refresh user list setelah penghapusan
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 401) {
        navigate('/', { replace: true });
        return;
      }
      alert(error.response?.data?.msg || 'Error deleting user');
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="w-full border border-gray-300 mt-5">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">No</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Created At</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((user, index) => (
            <tr key={user.uuid}>
              <td className="border border-gray-300 p-2 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role}</td>
              <td className="border border-gray-300 p-2">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => onEdit(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.uuid)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="px-3 py-1 mr-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-3 py-1 ml-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Userlist;
