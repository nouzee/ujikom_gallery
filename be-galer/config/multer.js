// config/multer.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Fungsi untuk membuat folder jika belum ada
const makeDirectory = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Konfigurasi penyimpanan untuk cover album
const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/covers';
        makeDirectory(dir);
        cb(null, dir); // Menyimpan di folder 'uploads/covers'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Konfigurasi penyimpanan untuk foto dalam album
const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/photos';
        makeDirectory(dir);
        cb(null, dir); // Menyimpan di folder 'uploads/photos'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Konfigurasi penyimpanan untuk news
const newsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/news';
        makeDirectory(dir);
        cb(null, dir); // Menyimpan di folder 'uploads/news'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Konfigurasi penyimpanan untuk events
const eventStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/events';
        makeDirectory(dir);
        cb(null, dir); // Menyimpan di folder 'uploads/events'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Filter jenis file untuk gambar
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Hanya gambar yang diperbolehkan (jpeg, jpg, png, gif)'));
};

// Inisialisasi multer dengan penyimpanan dan filter untuk cover, foto, dan news
export const uploadCover = multer({ storage: coverStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter }).single('gambar');
export const uploadPhoto = multer({ storage: photoStorage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter }).single('gambar');
export const uploadNews = multer({ 
    storage: newsStorage, 
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter 
}).single('gambar');
export const uploadEvent = multer({ 
    storage: eventStorage, 
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter 
}).single('gambar');
