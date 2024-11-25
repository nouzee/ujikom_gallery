import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const FormEditAlbum = ({ album, onClose }) => {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");

  useEffect(() => {
    if (album) {
      setNama(album.nama);
      setDeskripsi(album.deskripsi);
      setCategoryId(album.categoryId);
      setStatus(album.status);
      setPreview(album.gambar ? `${axios.defaults.baseURL}/${album.gambar}` : "");
    }
  }, [album]);

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
    const fetchCategories = async () => {
      try {
        await getCategories(); // Tidak tergantung pada token
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
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

  const getCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const loadImage = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const updateAlbum = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("categoryId", categoryId);
    formData.append("status", status);
    if (file) formData.append("gambar", file);

    try {
      await axiosJWT.patch(`/api/albums/${album.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Menambahkan token ke header
        },
      });
      onClose();
      window.location.reload();
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        console.error('Error response:', error.response.data);
      } else {
        setMsg('Terjadi kesalahan saat mengupdate album');
        console.error('Error details:', error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={updateAlbum}>
        <p className="has-text-centered text-red-500">{msg}</p>
        <div className="field">
          <label className="label">Nama Album</label>
          <div className="control">
            <input
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              type="text"
              placeholder="Nama Album"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Kategori</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value))}
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category.uuid} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Deskripsi</label>
          <div className="control">
            <textarea
              className="textarea"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi Album"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Cover Album max 5MB</label>
          <div className="control">
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  onChange={loadImage}
                  accept="image/*"
                />
                <span className="file-cta">
                  <span className="file-icon">
                    <i className="fas fa-upload"></i>
                  </span>
                  <span className="file-label">Pilih file...</span>
                </span>
                <span className="file-name">
                  {file ? file.name : "Tidak ada file baru dipilih"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {preview && (
          <div className="field">
            <figure className="image is-128x128">
              <img src={preview} alt="Preview" />
            </figure>
          </div>
        )}

        <div className="field">
            <label className='label'>Status</label>
            <div className="control">
                <div className="select is-fullwidth">
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Pilih Status</option>
                        <option value="user">User</option>
                        <option value="guest">Guest</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="field mt-4">
          <div className="control">
            <button type="submit" className="button is-success">
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormEditAlbum;
