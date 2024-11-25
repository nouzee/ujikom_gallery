import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
        <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Kontak Kami</h3>
            <p>Shinsei App, PT. Shinsei Technology</p>
            <p>Jl. Teknologi No. 123, Jakarta</p>
            <p>Email: info@shinseiapp.com</p>
            <p>Telepon: (021) 123-4567</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Tautan Cepat</h3>
            <ul>
              <li>
                <a
                  href="/"
                  className="text-gray-300 hover:text-cyan-400 transition duration-300"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/informasi"
                  className="text-gray-300 hover:text-cyan-400 transition duration-300"
                >
                  Informasi
                </a>
              </li>
              <li>
                <a
                  href="/agenda"
                  className="text-gray-300 hover:text-cyan-400 transition duration-300"
                >
                  Agenda
                </a>
              </li>
              <li>
                <a
                  href="/galeri"
                  className="text-gray-300 hover:text-cyan-400 transition duration-300"
                >
                  Galeri
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-300 hover:text-cyan-400 transition duration-300 text-2xl"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-300 hover:text-cyan-400 transition duration-300 text-2xl"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-300 hover:text-cyan-400 transition duration-300 text-2xl"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 text-center py-4">
          <p className="text-sm">&copy; 2024 Shinsei App. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer