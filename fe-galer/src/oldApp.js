import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './Style.css';

import Header from './components/dashboard/Header.jsx';
import Home from './components/dashboard/Home.jsx'; 
import Information from './components/dashboard/Information.jsx'; 
import HomePage from './components/dashboard/HomePage.jsx';
import Album from './components/dashboard/Album.jsx';
import Category from './components/dashboard/Category.jsx';

// import Landing from './components/webview/index.jsx';
import Login from './components/webview/Login.jsx';
import Register from './components/webview/Register.jsx';  

function oldApp() {
  return (

    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />


      <Route path="/dashboard" element={<Header />}>
        <Route index element={<Navigate to="/dashboard/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="information" element={<Information />} />
        <Route path="gallery" element={<Album />} />
        <Route path="category" element={<Category />} />
        {/* Route child */}
      </Route>

    </Routes>
      
  );
}

export default oldApp;
