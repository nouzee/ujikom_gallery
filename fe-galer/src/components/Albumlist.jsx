import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const Albumlist = ({ onEdit }) => {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // State untuk halaman saat ini
  const itemsPerPage = 8; // Jumlah data per halaman
  const navigate = useNavigate();

  useEffect(() => {
    const initializeToken = async () => {
      try {
        await refreshToken(); // Hanya dipanggil sekali saat komponen di-mount
      } catch (error) {
        console.error('Error initializing token:', error);
      }
    };
    initializeToken();
  }, []); // Dependency array kosong memastikan ini hanya berjalan sekali

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        await getAlbums(); // Tidak tergantung pada token
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    fetchAlbums();
  }, []); // Tidak menambahkan `token` ke dependency array

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

  const getAlbums = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/albums'); // Tidak memerlukan token
      setAlbums(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching albums:', error);
      setError('Gagal mengambil data album. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  const deleteAlbum = async (albumId) => {
    const confirmation = window.confirm('Are you sure you want to delete this album?');
    if (!confirmation) {
      return; // Tidak melanjutkan jika pengguna membatalkan
    }

    try {
      await axiosJWT.delete(`/api/albums/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAlbums(); // Refresh album list setelah berhasil menghapus
    } catch (error) {
      console.error('Error deleting album:', error);
      alert('Gagal menghapus album. Silakan coba lagi.');
    }
  };

  const viewAlbumPhotos = (albumId) => {
    navigate(`/home/albums/${albumId}/photos`);
  };

  // Sorting dan Pagination
  const sortedAlbums = [...albums].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort berdasarkan tanggal terbaru
  const paginatedAlbums = sortedAlbums.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Total Halaman
  const totalPages = Math.ceil(albums.length / itemsPerPage);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="has-text-danger">{error}</div>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
        {paginatedAlbums.map((item) => (
          <div
            key={item.uuid}
            className="bg-white border rounded-md overflow-hidden shadow-md transform transition-transform ease-in-out hover:scale-105 relative cursor-pointer"
          >
            <div onClick={() => viewAlbumPhotos(item.id)}>
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={`${axios.defaults.baseURL}/${item.gambar?.replace(/\\/g, '/')}`}
                  alt={item.nama}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80';
                  }}
                />
              </div>
              <div className="p-4">
                <div className="text-lg font-bold mb-2">{item.nama}</div>
                <p className="text-sm text-gray-700 mb-2">{item.deskripsi}</p>
                <p className="text-xs text-gray-500">Kategori: {item.category?.nama}</p>
                <p className="text-xs text-gray-500 mb-2">Status: {item.status}</p>
                <p className="text-xs text-gray-500">Dibuat Oleh: {item.user?.name}</p>
                <p className="text-xs text-gray-500">
                  Dibuat Pada: {format(parseISO(item.createdAt), "d MMMM yyyy", { locale: id })}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4">
              <button
                className="text-blue-500 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAlbum(item.id);
                }}
              >
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white border">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Albumlist;
