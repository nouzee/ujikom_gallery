import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const Galeri = () => {
  const [galeri, setGaleri] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [informasi, setInformasi] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galeriResponse, agendaResponse, informasiResponse, categoriesResponse] = await Promise.all([
          axios.get("/api/webalbums"),
          axios.get("/api/webevents"),
          axios.get("/api/webnews"),
          axios.get("/api/webcategories")
        ]);

        setGaleri(galeriResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setAgenda(agendaResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setInformasi(informasiResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAlbumsByCategory = async () => {
      if (selectedCategory) {
        try {
          const response = await axios.get(`/api/categories/${selectedCategory}/albums`);
          setGaleri(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
          console.error("Error fetching albums by category:", error);
        }
      } else {
        // If no category is selected, fetch all albums
        const response = await axios.get("/api/webalbums");
        setGaleri(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    };

    fetchAlbumsByCategory();
  }, [selectedCategory]);

  const constructImageUrl = (imagePath) => {
    return `${axios.defaults.baseURL}/${imagePath.replace(/\\/g, "/")}`;
  };

  const filteredGaleri = galeri.filter((item) =>
    item.nama
      ? item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  const totalPages = Math.ceil(filteredGaleri.length / itemsPerPage);
  const currentItems = filteredGaleri.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Search and Filter Section */}
      <div className="py-10 bg-gray-400 text-white text-center">
        <h1 className="text-3xl font-bold">Galeri</h1>
        <p className="mt-2 text-lg">Cari foto atau momen yang menarik</p>
        <div className="mt-6 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Cari foto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg shadow-md placeholder:text-gray-500 text-gray-800 focus:outline-none focus:ring focus:ring-cyan-300 mb-4"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-lg shadow-md text-gray-800 focus:outline-none focus:ring focus:ring-cyan-300"
          >
            <option value="">Pilih Kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="text-gray-800">
                {category.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Galeri Section */}
      <div className="py-12 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Galeri</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                onClick={() => navigate(`/galeri/${item.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={constructImageUrl(item.gambar)}
                  alt={item.nama}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/path/to/default-image.jpg";
                  }}
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {item.nama}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">
              Tidak ada data galeri yang ditemukan.
            </p>
          )}
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="py-6 flex justify-center items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg mr-2 disabled:bg-gray-300"
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4 py-2 text-lg text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg ml-2 disabled:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Agenda and Informasi Section */}
      <div className="py-12 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-6">
        {/* Agenda */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Agenda</h2>
          {agenda.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 mb-4 cursor-pointer"
              onClick={() => navigate("/agenda")}
            >
              <img
                src={constructImageUrl(item.gambar)}
                alt={item.nama}
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
                <p className="text-sm text-gray-500">
                  Di Post Tanggal:{" "}
                  {format(parseISO(item.createdAt), "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
            </div>
          ))}
          <a
            href="/agenda"
            className="block text-center bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-600 transition duration-300 mt-4"
          >
            Lihat semua agenda
          </a>
        </div>

        {/* Informasi */}
        <div className="bg-white shadow-lg rounded-xl p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi</h2>
          {informasi.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 mb-4 cursor-pointer"
              onClick={() => navigate("/informasi")}
            >
              <img
                src={constructImageUrl(item.gambar)}
                alt={item.nama}
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
                <p className="text-sm text-gray-500">
                  Di Post Tanggal:{" "}
                  {format(parseISO(item.createdAt), "dd MMMM yyyy", { locale: id })}
                </p>
              </div>
            </div>
          ))}
          <a
            href="/informasi"
            className="block text-center bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg hover:bg-cyan-600 transition duration-300 mt-4"
          >
            Lihat semua informasi
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Galeri;