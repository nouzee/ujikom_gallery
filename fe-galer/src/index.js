import React from 'react';
import ReactDOM from 'react-dom/client';
import "bulma/css/bulma.css";
import './Style.css';
import axios from "axios";
import App from './App';
import { Provider } from 'react-redux';
import store from './store.js';

// Axios default config
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Axios interceptors untuk handling errors
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

