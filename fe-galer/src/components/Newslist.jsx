import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';

const Newslist = ({ onEdit }) => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchNews = async () => {
      try {
        await getNews();
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('/api/token');
      const newToken = response.data.accessToken;
      const decoded = jwtDecode(newToken);

      if (newToken !== token || decoded.exp !== expire) {
        setToken(newToken);
        setExpire(decoded.exp);
      }
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
    (error) => Promise.reject(error)
  );

  const getNews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/news');
      setNews(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); // Sort berita berdasarkan tanggal terbaru
      setError(null);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteNews = async (newsId) => {
    const confirmation = window.confirm('Are you sure you want to delete this news?');
    if (!confirmation) return;

    try {
      await axiosJWT.delete(`/api/news/${newsId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('News deleted successfully.');
      getNews();
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news. Please try again.');
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(news.length / itemsPerPage);
  const displayedNews = news.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="has-text-danger">{error}</div>;

  return (
    <div>
      <table className="w-full border border-gray-300 mt-5">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center text-gray-500">No</th>
            <th className="border border-gray-300 p-2 text-gray-500">Judul</th>
            <th className="border border-gray-300 p-2 text-gray-500">Deskripsi</th>
            <th className="border border-gray-300 p-2 text-gray-500">Gambar</th>
            <th className="border border-gray-300 p-2 text-gray-500">Created By</th>
            <th className="border border-gray-300 p-2 text-gray-500">Created At</th>
            <th className="border border-gray-300 p-2 text-gray-500">Status</th>
            <th className="border border-gray-300 p-2 text-gray-500">Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedNews.map((item, index) => (
            <tr key={item.uuid}>
              <td className="border border-gray-300 p-2 text-center">{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td className="border border-gray-300 p-2">{item.nama}</td>
              <td className="border border-gray-300 p-2">{item.deskripsi}</td>
              <td className="border border-gray-300 p-2">
                {item.gambar && (
                  <img
                    src={`${axios.defaults.baseURL}/${item.gambar.replace(/\\/g, '/')}`}
                    alt="News"
                    className="w-20 h-20 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80';
                    }}
                  />
                )}
              </td>
              <td className="border border-gray-300 p-2">{item.user?.name}</td>
              <td className="border border-gray-300 p-2">
                {format(parseISO(item.createdAt), "d MMMM yyyy", { locale: id })}
              </td>
              <td className="border border-gray-300 p-2">{item.status}</td>
              <td className="border border-gray-300 p-2 text-center">
                <button className="button is-small is-info mb-2 mr-2" onClick={() => onEdit(item)}>
                  Edit
                </button>
                <button onClick={() => deleteNews(item.id)} className="button is-small is-danger">
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
        <span>Page {currentPage} of {totalPages}</span>
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

export default Newslist;
