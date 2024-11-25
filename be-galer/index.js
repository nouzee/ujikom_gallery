import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";
import path from 'path';
import { fileURLToPath } from 'url';

import UsersRoute from "./routes/UsersRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import AlbumRoute from "./routes/AlbumRoute.js";
import FotoRoute from "./routes/FotoRoute.js";
import NewsRoute from "./routes/NewsRoute.js";
import EventRoute from "./routes/EventRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

// ES Module fix untuk __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// Middleware
app.use(cors({ 
    credentials: true, 
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

app.use(cookieParser());
app.use(express.json());

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// Static files middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use(UsersRoute);
app.use(NewsRoute);
app.use(EventRoute);
app.use(CategoryRoute);
app.use(AlbumRoute);
app.use(FotoRoute);
app.use(AuthRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// Menjalankan Server
const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
