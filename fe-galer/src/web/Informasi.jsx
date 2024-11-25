import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';

const Informasi = () => {
  const [informasi, setInformasi] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInformasi = async () => {
      try {
        const response = await axios.get("/api/webnews");
        setInformasi(response.data);
      } catch (error) {
        console.error("Error fetching informasi:", error);
      }
    };

    const fetchAgenda = async () => {
      try {
        const response = await axios.get("/api/webevents");
        setAgenda(response.data);
      } catch (error) {
        console.error("Error fetching agenda:", error);
      }
    };

    const fetchGaleri = async () => {
      try {
        const response = await axios.get("/api/webalbums");
        setGaleri(response.data);
      } catch (error) {
        console.error("Error fetching galeri:", error);
      }
    };

    fetchInformasi();
    fetchAgenda();
    fetchGaleri();
  }, []);

  const constructImageUrl = (imagePath) => {
    return `${axios.defaults.baseURL}/${imagePath.replace(/\\/g, '/')}`;
  };

  // Filter based on search term
  const filteredInformasi = informasi.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredInformasi.length / itemsPerPage);
  const currentItems = filteredInformasi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Search Section */}
      <div className="py-10 bg-gray-400 text-white text-center">
        <h1 className="text-3xl font-bold">Informasi</h1>
        <p className="mt-2 text-lg">Cari informasi terbaru di sini</p>
        <div className="mt-6 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Cari informasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg shadow-md placeholder:text-gray-500 text-gray-800 focus:outline-none focus:ring focus:ring-cyan-300"
          />
        </div>
      </div>

      {/* Informasi Section */}
      <div className="py-12 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Informasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentItems
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item) => {
              const imageUrl = constructImageUrl(item.gambar);
              return (
                <div
                  key={item.id}
                  className="bg-cyan-50 shadow-lg rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/informasi/${item.id}`)}
                >
                  <img
                    src={imageUrl}
                    alt={item.judul}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/path/to/default-image.jpg';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                      {item.nama}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      Di Post Tanggal : {format(parseISO(item.createdAt), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Pagination for Informasi Section */}
      {totalPages > 1 && (
        <div className="py-6 max-w-6xl mx-auto text-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg mr-2"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span className="px-4 py-2 text-lg text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg ml-2"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Agenda and Galeri Section */}
      <div className="py-12 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        {/* Agenda */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Agenda</h2>
          {agenda
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
            .map((item) => {
              const imageUrl = constructImageUrl(item.gambar);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 mb-4 cursor-pointer"
                  onClick={() => navigate("/agenda")}
                >
                  <img
                    src={imageUrl}
                    alt={item.judul}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default-image.jpg";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.nama}
                    </h3>
                    <p className="text-sm text-gray-500 text-center">
                      Di Post Tanggal : {format(parseISO(item.createdAt), 'dd MMMM yyyy', { locale: id })}
                    </p>
                  </div>
                </div>
              );
            })}
          <a
            href="/agenda"
            className="block text-center bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-600 transition duration-300 mt-4"
          >
            Lihat semua agenda
          </a>
        </div>

        {/* Galeri */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Galeri</h2>
          <div className="grid grid-cols-2 gap-4">
            {galeri
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 2)
              .map((item) => {
                const imageUrl = constructImageUrl(item.gambar);
                return (
                  <img
                    key={item.id}
                    src={imageUrl}
                    alt={`Galeri ${item.id}`}
                    className="w-full h-full object-cover rounded-lg"
                    onClick={() => navigate("/galeri")}
                    style={{ cursor: "pointer" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default-image.jpg";
                    }}
                  />
                );
              })}
          </div>
          <a
            href="/galeri"
            className="block text-center bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-600 transition duration-300 mt-4"
          >
            Lihat galeri lengkap
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Informasi;
