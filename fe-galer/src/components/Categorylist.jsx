import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';

const Categorylist = ({ onEdit }) => {
  const [category, setCategory] = useState([]);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const itemsPerPage = 5; // Jumlah item per halaman

  useEffect(() => {
    const initializeToken = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Error initializing token:', error);
      }
    };
    initializeToken();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        await getCategory();
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('/api/token');
      setToken(response.data.accessToken);
      const decoded = jwtDecode(response.data.accessToken);
      setExpire(decoded.exp);
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get('/api/token');
        config.headers.Authorization = `Bearer ${response.data.accessToken}`;
        setToken(response.data.accessToken);
        const decoded = jwtDecode(response.data.accessToken);
        setExpire(decoded.exp);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const getCategory = async () => {
    try {
      const response = await axiosJWT.get('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategory(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort berdasarkan `createdAt` terbaru
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (!confirmation) return;

    try {
      await axiosJWT.delete(`/api/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getCategory();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Gagal menghapus kategori. Silakan coba lagi.');
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(category.length / itemsPerPage);
  const displayedCategories = category.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <table className="w-full border border-gray-300 mt-5">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center text-gray-500">No</th>
            <th className="border border-gray-300 p-2 text-gray-500">Nama Kategori</th>
            <th className="border border-gray-300 p-2 text-gray-500">Deskripsi</th>
            <th className="border border-gray-300 p-2 text-gray-500">Created By</th>
            <th className="border border-gray-300 p-2 text-gray-500">Created At</th>
            <th className="border border-gray-300 p-2 text-gray-500">Status</th>
            <th className="border border-gray-300 p-2 text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedCategories.map((item, index) => (
            <tr key={item.uuid}>
              <td className="border border-gray-300 p-2 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="border border-gray-300 p-2">{item.nama}</td>
              <td className="border border-gray-300 p-2">{item.deskripsi}</td>
              <td className="border border-gray-300 p-2">{item.user.name}</td>
              <td className="border border-gray-300 p-2">
                {format(parseISO(item.createdAt), "d MMMM yyyy", { locale: id })}
              </td>
              <td className="border border-gray-300 p-2">{item.status}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  className="button is-small is-info mb-2 mr-2"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteCategory(item.uuid)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4">
        <button
          className="button is-small mr-2"
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="button is-small ml-2"
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Categorylist;
