import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import WebNav from './WebNav';

const WebLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshToken(); // Refresh token saat komponen di-mount
      } catch (error) {
        console.error('Error refreshing token:', error);
        navigate('/'); // Redirect ke halaman login jika gagal mendapatkan token
      }
    };

    initializeAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get('/api/token');
      const decoded = jwtDecode(response.data.accessToken);

      // Simpan token dan informasi terkait di localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userName', decoded.name);
      localStorage.setItem('tokenExpire', decoded.exp);
    } catch (error) {
      throw error; // Lemparkan error jika refresh token gagal
    }
  };

  return (
    <div>
      <WebNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default WebLayout;
