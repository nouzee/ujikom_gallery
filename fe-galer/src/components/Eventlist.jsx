import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';

const Eventlist = ({ onEdit }) => {
  const [events, setEvents] = useState([]);
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
    const fetchEvents = async () => {
      try {
        await getEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
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
    (error) => {
      return Promise.reject(error);
    }
  );

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events');
      const sortedEvents = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort berdasarkan tanggal terbaru
      setEvents(sortedEvents);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    const confirmation = window.confirm('Are you sure you want to delete this agenda?');
    if (!confirmation) return;

    try {
      await axiosJWT.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(events.length / itemsPerPage);
  const displayedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {displayedEvents.map((item, index) => (
            <tr key={item.uuid}>
              <td className="border border-gray-300 p-2 text-center">
                {(currentPage - 1) * itemsPerPage + index + 1}
              </td>
              <td className="border border-gray-300 p-2">{item.nama}</td>
              <td className="border border-gray-300 p-2">{item.deskripsi}</td>
              <td className="border border-gray-300 p-2">
                {item.gambar && (
                  <img
                    src={`${axios.defaults.baseURL}/${item.gambar.replace(/\\/g, '/')}`}
                    alt="Event"
                    className="w-20 h-20 object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', item.gambar);
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
                <button
                  className="button is-small is-info mb-2 mr-2"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEvent(item.id)}
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

export default Eventlist;
