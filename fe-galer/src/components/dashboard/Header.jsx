import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navLinkClass = "w-full px-3 py-2.5 text-lg block text-white-100 hover:bg-white hover:text-[#7386D5] hover:rounded-lg transition-all duration-300";
  const activeNavLinkClass = "!bg-white !text-[#7386D5] rounded-lg";

  const navigate = useNavigate();

  const Logout = async() => {
    try {
      await axios.delete('http://localhost:5000/logout');
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={`flex h-screen ${isSidebarOpen ? 'sidebar-active' : ''}`}>
      {/* Sidebar */}
      <nav className={`
        flex flex-col justify-between
        min-w-[250px] max-w-[250px] 
        bg-[#7386D5] text-white
        transition-all duration-300
        fixed h-full z-20
        ${isSidebarOpen ? 'left-0' : '-left-[250px]'}
      `}>
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
          <ul className="py-5 border-b border-[#47748b] flex flex-col items-center space-y-2">
            <li className="w-full px-4">
              <NavLink
                to="/dashboard/home"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`
                }
              >
                Gallery Information
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/dashboard/homepage"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/dashboard/information"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`
                }
              >
                Information
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/dashboard/gallery"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`
                }
              >
                Gallery
              </NavLink>
            </li>
            <li className="w-full px-4">
              <NavLink
                to="/dashboard/category"
                className={({ isActive }) =>
                  `${navLinkClass} ${isActive ? activeNavLinkClass : ''}`
                }
              >
                Category
              </NavLink>
            </li>
          </ul>

          <ul className="p-5 flex justify-center">
            <li>
              <button 
              onClick={Logout} 
              className="px-4 py-2 text-base text-white bg-[#6d7fcc] rounded hover:bg-[#5a6cb8] transition-colors duration-300">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Toggle button for closed sidebar */}
      {!isSidebarOpen && (
        <button
          type="button"
          className="fixed top-4 left-4 z-30 px-3 py-2 bg-[#7386D5] text-white rounded shadow-lg border-none focus:outline-none hover:bg-[#6d7fcc] transition-colors duration-300"
          onClick={handleToggleSidebar}
        >
          <span className="text-xl">☰</span>
        </button>
      )}

      {/* Main content */}
      <div className={`
        flex-1 min-h-screen transition-all duration-300 
        ${isSidebarOpen ? 'ml-[250px]' : 'ml-0'}
      `}>
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Header;