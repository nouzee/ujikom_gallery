import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const FormAddEvent = ({ onClose }) => {
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState("");
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState("");
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState('');  // Token state kosong
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
  

  // Fungsi untuk refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.get('/api/token');
      const newToken = response.data.accessToken;
      const decoded = jwtDecode(newToken);
  
      // Hanya set state jika ada perubahan
      if (newToken !== token || decoded.exp !== expire) {
        setToken(newToken);
        setExpire(decoded.exp);
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }
  };
  

  // Menggunakan interceptor untuk menyertakan token pada setiap permintaan
  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        await refreshToken();  // Refresh token jika sudah kadaluarsa
      }
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("deskripsi", deskripsi);
    formData.append("gambar", file);
    formData.append("status", status);
    try {
      await axiosJWT.post('/api/events', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to save event:', error.response || error.message);
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };
  

  return (
    <div>
      <form onSubmit={saveEvent}>
        <p className='has-text-centered text-red-500'>{msg}</p>
        <div className="field">
          <label className='label'>Judul</label>
          <div className="control">
            <input
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              type="text"
              placeholder="Judul Event"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Deskripsi</label>
          <div className="control">
            <textarea
              className="textarea"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className='label'>Gambar max 5MB</label>
          <div className="control">
            <div className="file has-name is-fullwidth">
              <label className="file-label">
                <input
                  className="file-input"
                  type="file"
                  onChange={loadImage}
                  accept="image/*"
                  required
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
                  {file ? file.name : "Tidak ada file dipilih"}
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
            <button type="submit" className='button is-success'>
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormAddEvent;
