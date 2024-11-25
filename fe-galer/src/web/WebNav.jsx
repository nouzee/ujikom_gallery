import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "./logo3.png";
import { FaBars, FaTimes } from "react-icons/fa";

const WebNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getNavLinkClass = ({ isActive }) =>
    `relative text-sm font-medium text-gray-700 transition-all duration-300 hover:text-gray-900 ${
      isActive ? "bg-white text-gray-900 shadow-md" : ""
    }`;

  return (
    <header className="fixed top-2 z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-evenly gap-3 rounded-2xl bg-white/50 px-4 shadow-lg shadow-black/[0.03] backdrop-blur-lg before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(white,white)_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)]">
          {/* Logo */}
          <div className="flex flex-1 items-center">
            <NavLink to="/" className="flex items-center">
              <img src={logo} alt="Logo" className="h-14 w-14" />
              <span className="text-lg font-semibold text-gray-800">
                SchoolShin
              </span>
            </NavLink>
          </div>

          {/* Hamburger Menu (Visible on Mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <ul className="hidden md:flex md:w-auto md:items-center md:justify-end gap-6">
            {["Beranda", "Informasi", "Agenda", "Galeri"].map((menu, index) => (
              <li key={index}>
                <NavLink
                  to={`/${menu.toLowerCase()}`}
                  className={getNavLinkClass}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                  }}
                >
                  {menu}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cyan-500 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Navigation Links (Mobile) */}
          <ul
            className={`fixed top-16 left-4 right-4 rounded-2xl bg-white/50 shadow-lg shadow-black/[0.03] backdrop-blur-lg p-4 md:hidden transition-all duration-300 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            {["Beranda", "Informasi", "Agenda", "Galeri"].map((menu, index) => (
              <li key={index} className="border-b border-gray-200 last:border-none">
                <NavLink
                  to={`/${menu.toLowerCase()}`}
                  className={getNavLinkClass}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "1rem",
                  }}
                  onClick={() => setIsMenuOpen(false)} // Close menu on link click
                >
                  {menu}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default WebNav;
