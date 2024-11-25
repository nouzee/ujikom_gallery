import './Style.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import Users from './pages/Users.jsx';
import Category from './pages/Category.jsx';
import Album from './pages/Album.jsx';
import News from './pages/News.jsx';
import Event from './pages/Event.jsx';
import AlbumPhotos from "./pages/AlbumPhotos";
import Beranda from './web/Beranda.jsx';
import Informasi from './web/Informasi.jsx';
import Agenda from './web/Agenda.jsx';
import Galeri from './web/Galeri.jsx';
import Albumdetail from './web/Albumdetail.jsx';
import Infodetail from './web/Infodetail.jsx';
import Agendadetail from './web/Agendadetail.jsx';
import WebLayout from './web/WebLayout.jsx';


function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route element={<WebLayout />}>
                    <Route path='/' element={<Beranda/>}/>
                    <Route path='/informasi' element={<Informasi/>}/>
                    <Route path='/agenda' element={<Agenda/>}/>
                    <Route path='/galeri' element={<Galeri/>}/>
                    <Route path='/galeri/:id' element={<Albumdetail/>}/>
                    <Route path='/informasi/:id' element={<Infodetail/>}/>
                    <Route path='/agenda/:id' element={<Agendadetail/>}/>
                </Route>

                <Route path='/login' element={<Login/>}/>

                <Route path="/home" element={<Layout/>}>
                    <Route index element={<Navigate to="album" />} />
                    <Route path='dashboard' element={<Dashboard />} /> 
                    <Route path='category' element={<Category />} /> 
                    <Route path='users' element={<Users />} /> 
                    <Route path='album' element={<Album />} /> 
                    <Route path="albums/:albumId/photos" element={<AlbumPhotos />} />
                    <Route path='news' element={<News />} /> 
                    <Route path='event' element={<Event />} /> 
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </div>      
  );
}

export default App;
