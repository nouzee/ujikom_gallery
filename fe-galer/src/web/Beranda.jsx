import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";
import bg from "./smkn4bogor_2.jpg";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import id from 'date-fns/locale/id';  

const Beranda = () => {
  const [informasi, setInformasi] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [galeri, setGaleri] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data for Informasi
    const fetchInformasi = async () => {
      try {
        const response = await axios.get("/api/webnews");
        setInformasi(response.data);
      } catch (error) {
        console.error("Error fetching informasi:", error);
      }
    };

    // Fetch data for Agenda
    const fetchAgenda = async () => {
      try {
        const response = await axios.get("/api/webevents");
        setAgenda(response.data);
      } catch (error) {
        console.error("Error fetching agenda:", error);
      }
    };

    // Fetch data for Galeri
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

  return (
    <div>
      {/* Banner Section */}
      <section
        className="relative bg-cover bg-center bg-no-repeat h-[60vh] md:h-[80vh] mt-16"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Selamat Datang
          </h1>
          <p className="mt-4 text-lg text-gray-300 md:text-xl">
            Kami menghargai kunjungan Anda.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 text-center">
          {/* Informasi */}
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
            Informasi
          </h2>
          <p className="mt-4 text-gray-600">
            Kumpulan - Kumpulan informasi atau berita terkini.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {informasi
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((item) => {
                const imageUrl = constructImageUrl(item.gambar);
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-white shadow-lg rounded-xl cursor-pointer"
                    onClick={() => navigate('/informasi')}
                  >
                    <img
                      src={imageUrl}
                      alt={item.nama}
                      className="w-full h-52 object-cover rounded-lg"
                    />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">
                      {item.nama}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Di Post Tanggal :{" "}
                      {format(parseISO(item.createdAt), "dd MMMM yyyy", {
                        locale: id,
                      })}
                    </p>
                  </div>
                );
              })}
          </div>

          {/* Agenda */}
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl mt-16">
            Agenda
          </h2>
          <p className="mt-4 text-gray-600">
            Jadwal acara dan kegiatan terbaru.
          </p>
          <div className="mt-10 grid gap-6">
            {agenda
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 2)
              .map((item) => {
                const imageUrl = constructImageUrl(item.gambar);
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-cyan-50 shadow-lg rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4 cursor-pointer"
                    onClick={() => navigate('/agenda')}
                  >
                    <img
                      src={imageUrl}
                      alt={item.nama}
                      className="w-full md:w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.nama}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Di Post Tanggal :{" "}
                        {format(parseISO(item.createdAt), "dd MMMM yyyy", {
                          locale: id,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Galeri */}
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl mt-16">
            Galeri
          </h2>
          <p className="mt-4 text-gray-600">Kumpulan dokumentasi terupdate kami.</p>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {galeri
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 4)
              .map((item) => {
                const imageUrl = constructImageUrl(item.gambar);
                return (
                  <div
                    key={item.id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => navigate('/galeri')}
                  >
                    <img
                      src={imageUrl}
                      alt={item.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <div className="py-16 bg-gray-200">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl text-center">
            Lokasi Kami
          </h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.049697423988!2d106.8220736134886!3d-6.640751050179497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c8b16ee07ef5%3A0x14ab253dd267de49!2sSMK%20Negeri%204%20Bogor%20(Nebrazka)!5e0!3m2!1sid!2sid!4v1732161950981!5m2!1sid!2sid"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Beranda;
