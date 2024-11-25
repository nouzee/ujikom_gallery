import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, reset } from '../features/authSlice';
import { FaArrowRight } from "react-icons/fa";

const Sidebar = ({ isOpen, onToggle }) => {
  const navLinkClass = "w-full px-3 py-2.5 text-lg block text-white-100 hover:bg-white hover:text-[#7386D5] hover:rounded-lg transition-all duration-300";
  const activeNavLinkClass = "!bg-white !text-[#7386D5] rounded-lg";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.auth);

  const logout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      dispatch(LogOut());
      dispatch(reset());
      navigate("/");
    }
  };

  const handleWebsite = () => {
    navigate("/");
  }
  

  const handleToggleSidebar = () => {
    onToggle();
  };

  return (
    <div className={`${isOpen ? "sidebar-active" : ""}`}>
      {/* Sidebar */}
      <nav
        className={`
        flex flex-col justify-between
        min-w-[250px] max-w-[250px] 
        bg-[#7386D5] text-white
        transition-all duration-300
        fixed h-full z-20
        ${isOpen ? "left-0" : "-left-[250px]"}
      `}
      >
        <div className="p-5 bg-[#6d7fcc] text-center flex items-center justify-between">
          <h3 className="text-xl font-medium">Gallery Management</h3>
          <button
            type="button"
            className="p-2 text-white hover:bg-[#5a6cb8] rounded transition-colors duration-300"
            onClick={handleToggleSidebar}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="flex-grow flex flex-col">
          <ul className="py-5 border-[#47748b] flex flex-col items-center space-y-2">
            {/* <li className="w-full px-4">
              <NavLink
                to="/home/dashboard"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Dashboard
              </NavLink>
            </li> */}
            <li className="w-full px-4">
              <NavLink
                to="/home/category"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Category
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/home/news"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Informasi
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/home/event"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Agenda
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/home/album"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                }
              >
                Albums
              </NavLink>
            </li>
          </ul>

          {user && user.role === "admin" && (
            <div>
              <ul className="w-full py-5 flex flex-col space-y-2">
                <li className="w-full px-4">
                  <NavLink
                    to="/home/users"
                    className={({ isActive }) =>
                      `${navLinkClass} ${isActive ? activeNavLinkClass : ""}`
                    }
                  >
                    Users
                  </NavLink>
                </li>
              </ul>
            </div>
          )}

          <ul className="p-5 flex justify-center">
            <li>
              <button
                onClick={logout}
                className="px-4 py-2 text-base text-white bg-[#6d7fcc] rounded hover:bg-[#5a6cb8] transition-colors duration-300"
              >
                Logout
              </button>
            </li>
          </ul>
          <ul className="w-full p-5 flex justify-center">
            <li className="w-full">
              <button
                onClick={handleWebsite}
                className="w-full px-4 py-2 text-base text-white bg-[#6d7fcc] rounded hover:bg-[#5a6cb8] transition-colors duration-300"
              >
                <p className="flex justify-center">Website <FaArrowRight className="ml-2" /></p>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Toggle button for closed sidebar */}
      {!isOpen && (
        <button
          type="button"
          className="fixed top-4 left-4 z-30 px-3 py-2 bg-[#7386D5] text-white rounded shadow-lg border-none focus:outline-none hover:bg-[#6d7fcc] transition-colors duration-300"
          onClick={handleToggleSidebar}
        >
          <span className="text-xl">☰</span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;