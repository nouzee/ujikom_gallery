import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const FormEditFoto = ({ photo, onClose, onSuccess }) => {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [status, setStatus] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  useEffect(() => {
    if (photo) {
      setNama(photo.nama);
      setDeskripsi(photo.deskripsi);
      setPreview(photo.gambar ? `${axios.defaults.baseURL}/${photo.gambar}` : "");
    }
  }, [photo]);

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

  const loadImage = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const updateFoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("status", status);
    if (file) formData.append("gambar", file);

    try {
      await axiosJWT.patch(`/api/fotos/${photo.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Menambahkan token ke header
        },
      });
      onSuccess(); // Refresh daftar foto
      onClose(); // Tutup modal
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <form onSubmit={updateFoto}>
        <p className='has-text-centered text-red-500'>{msg}</p>
        <div className="field">
          <label className="label">Nama Foto</label>
          <div className="control">
            <input
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              type="text"
              placeholder="Nama Foto"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Deskripsi</label>
          <div className="control">
            <textarea
              className="textarea"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi Foto"
              required
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Foto max 5MB</label>
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
                  <span className="file-label">
                    Pilih file...
                  </span>
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

export default FormEditFoto;
