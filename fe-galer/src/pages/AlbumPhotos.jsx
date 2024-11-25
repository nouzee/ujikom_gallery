import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import FormAddFoto from '../components/FormAddFoto';
import FormEditFoto from '../components/FormEditFoto';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaEdit, FaRegTrashAlt, FaPlus } from 'react-icons/fa';

const AlbumPhotos = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [album, setAlbum] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

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
    const fetchAlbumPhotos = async () => {
      try {
        await getAlbumPhotos(); // Tidak tergantung pada token
      } catch (error) {
        console.error('Error fetching album photos:', error);
      }
    };
    fetchAlbumPhotos();
  }, []); // Tidak menambahkan `token` ke dependency array
  
  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        await getAlbumDetails(); // Tidak tergantung pada token
      } catch (error) {
        console.error('Error fetching album details:', error);
      }
    };
    fetchAlbumDetails();
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
    (error) => Promise.reject(error)
  );

  const getAlbumDetails = async () => {
    try {
      const response = await axios.get(`/api/albums/${albumId}`);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error fetching album details:', error);
      setError('Gagal mengambil detail album');
    }
  };

  const getAlbumPhotos = async () => {
    try {
      const response = await axios.get(`/api/albums/${albumId}/fotos`);
      setPhotos(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Gagal mengambil foto-foto album');
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId) => {

    const confirmation = window.confirm('Are you sure you want to delete this photo?');
    if (!confirmation) {
      return; // Tidak melanjutkan jika pengguna membatalkan
    }

    try {
      await axiosJWT.delete(`/api/fotos/${photoId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Menambahkan token di header
        },
      });
      getAlbumPhotos();
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Gagal menghapus foto');
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (photo) => {
    setSelectedPhoto(photo);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => {
    setSelectedPhoto(null);
    setIsEditModalOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      {album && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{album.nama}</h1>
          <p className="text-gray-600">{album.deskripsi}</p>
        </div>
      )}

      <button
        className="button is-primary mb-4 flex items-center"
        onClick={openAddModal}
      >
        <FaPlus className="mr-2" /> Tambah Foto
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.uuid} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`${axios.defaults.baseURL}/${photo.gambar?.replace(/\\/g, '/')}`}
              alt={photo.nama}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200';
              }}
            />
            <div className="p-4">
              <h3 className="font-semibold mb-2">{photo.nama}</h3>
              <p className="text-sm text-gray-600 mb-2">{photo.deskripsi}</p>           
              <p className="text-xs text-gray-500">Album : {photo.album?.nama}</p>
              <p className="text-xs text-gray-500 mb-2">Status : {photo.status}</p>
              <p className="text-xs text-gray-500">Dibuat oleh : {photo.user?.name}</p>
              <p className="text-xs text-gray-500">
                {format(parseISO(photo.createdAt), 'd MMMM yyyy', { locale: id })}
              </p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => openEditModal(photo)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Foto */}
      {isAddModalOpen && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeAddModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Tambah Foto Baru</p>
              <button className="delete" onClick={closeAddModal}></button>
            </header>
            <section className="modal-card-body">
              <FormAddFoto albumId={albumId} onClose={closeAddModal} onSuccess={getAlbumPhotos} />
            </section>
          </div>
        </div>
      )}

      {/* Modal Edit Foto */}
      {isEditModalOpen && selectedPhoto && (
        <div className="modal is-active">
          <div className="modal-background" onClick={closeEditModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Edit Foto</p>
              <button className="delete" onClick={closeEditModal}></button>
            </header>
            <section className="modal-card-body">
              <FormEditFoto
                photo={selectedPhoto}
                onClose={closeEditModal}
                onSuccess={getAlbumPhotos}
              />
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumPhotos;
