import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const FormEditCategory = ({ category, onClose }) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');

  useEffect(() => {
    if (category) {
      setNama(category.nama);
      setDeskripsi(category.deskripsi);
      setStatus(category.status);
    }
  }, [category]);

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

  const updateCategory = async (e) => {
    e.preventDefault();
    try {
      await axiosJWT.patch(
        `http://localhost:5000/api/categories/${category.id}`,
        { nama, deskripsi, status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
      onClose();
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <form onSubmit={updateCategory}>
        <p className="has-text-centered text-red-500">{msg}</p>
        <div className="field">
          <label className="label">Nama</label>
          <div className="control">
            <input
              className="input"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              type="text"
              placeholder="Nama Kategori"
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Deskripsi</label>
          <div className="control">
            <input
              className="input"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              type="text"
              placeholder="Deskripsi"
              required
            />
          </div>
        </div>
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
        <div className="field">
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

export default FormEditCategory;
