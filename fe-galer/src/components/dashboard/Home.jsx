import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await refreshToken();
                await getUsers();
            } catch (error) {
                navigate("/"); // Kembali ke halaman login jika token tidak valid
            }
        };

        verifyUser();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('/api/token');
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/"); // Kembali ke login jika token tidak valid
            }
        }
    };

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async () => {
        try {
            const response = await axiosJWT.get('http://localhost:5000/users', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/"); // Redirect ke login jika tidak terautentikasi
            }
        }
    };

    return (
        <div>    
            <div className="container">
                <div className="row">
                    <div className="col-md-12 mt-4">
                        <p>WELCOME TO MY GALLERY</p>
                        <h5>Welcome To Dashboard {name} !</h5>
                        <button onClick={getUsers} className="button is-info">Get Users</button>
                    </div>
                </div>
                <table className="table is-striped is-fullwidth">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))}                      
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Home;
