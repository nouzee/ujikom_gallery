'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale/id';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const Agendadetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchAgendaDetail = async () => {
      try {
        const response = await axios.get(`/api/webevents/${id}`);
        setDetail(response.data);
      } catch (error) {
        console.error("Error fetching agenda detail:", error);
      }
    };
    fetchAgendaDetail();

    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      compact: false,
      idle: false,
      dragToClose: false,
      Toolbar: {
        display: {
          left: ["infobar"],
          middle: [
            "zoomIn",
            "zoomOut",
            "toggle1to1",
            "rotateCCW",
            "rotateCW",
            "flipX",
            "flipY",
          ],
          right: [
            "slideshow",
            "thumbs",
            "download",
            "close"
          ],
        },
      },
      Thumbs: {
        autoStart: false,
      },
      Slideshow: {
        autoStart: false,
        speed: 3000,
      },
      Images: {
        Panzoom: {
          maxScale: 5,
        },
      },
      on: {
        "Fancybox.initCarousel": (fancybox) => {
          // Add custom download button functionality
          const downloadBtn = fancybox.container.querySelector(".fancybox__button--download")
          if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
              const currentSlide = fancybox.getSlide()
              if (currentSlide) {
                const imageUrl = currentSlide.src
                const link = document.createElement("a")
                link.href = imageUrl
                link.download = `agenda_image.jpg`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }
            })
          }
        },
      },
    });

    // Cleanup function
    return () => {
      Fancybox.destroy();
    };
  }, [id]);

  // Helper function to construct image URL
  const constructImageUrl = (imagePath) => {
    return `${axios.defaults.baseURL}/${imagePath.replace(/\\/g, '/')}`;
  };

  // Default image to use when the image fails to load
  const defaultImage = '/path/to/default-image.jpg'; // Replace with your default image path

  if (!detail) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Agenda tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto py-12 px-6 bg-white shadow-lg rounded-lg">
        <a
          data-fancybox="agenda-image"
          href={constructImageUrl(detail.gambar)}
          data-caption={detail.judul || "Agenda"}
          className="block relative overflow-hidden rounded-lg"
        >
          <img
            src={constructImageUrl(detail.gambar)}
            alt={detail.judul || "Agenda"}
            className="w-full h-72 object-cover rounded-lg transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = defaultImage; // Fallback to default image
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <p className="text-lg font-medium text-white">Lihat Detail</p>
          </div>
        </a>
        <h1 className="mt-6 text-3xl font-bold text-gray-800">{detail.nama}</h1>
        <p className="mt-2 text-sm text-gray-500">
          Di Post Tanggal: {format(parseISO(detail.createdAt), 'dd MMMM yyyy', { locale: localeId })}
        </p>
        <p className="mt-4 text-gray-700 leading-relaxed">{detail.deskripsi}</p>
      </div>
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
};

export default Agendadetail;