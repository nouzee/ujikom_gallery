import React, {useEffect, useState} from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from '../features/authSlice.js';
import Sidebar from '../components/Sidebar.jsx';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user, isLoading } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-light">    
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className={`
        flex-1 p-5 transition-all duration-300
        ${isSidebarOpen ? 'ml-[250px]' : 'ml-0'}
      `}>
        <main className="container mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;