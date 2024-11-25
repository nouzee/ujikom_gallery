import News from "../models/NewsModel.js";
import Users from "../models/UsersModel.js";
import fs from 'fs';
import { Op } from 'sequelize';

// Get all news
export const getWebNews = async (req, res) => {
    try {
        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan user dapat melihat berita dengan status "guest" atau "user"
            response = await News.findAll({
                where: {
                    [Op.or]: [
                        { status: 'guest' },
                        { status: 'user' }
                    ]
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            // Guest hanya melihat berita dengan status "guest"
            response = await News.findAll({
                where: { status: 'guest' },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get news by ID
export const getWebNewsById = async (req, res) => {
    try {
        const news = await News.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Users,
                attributes: ['name', 'email', 'role']
            }]
        });

        if (!news) return res.status(404).json({ msg: "Berita tidak ditemukan" });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan user dapat melihat berita dengan status "guest" atau "user"
            if (news.status === "guest" || news.status === "user") {
                response = news;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke berita ini" });
            }
        } else {
            // Guest hanya dapat melihat berita dengan status "guest"
            if (news.status === "guest") {
                response = news;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke berita ini" });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// dibawah ini untuk halaman manajemen


// Get all news
export const getNews = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await News.findAll({
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            response = await News.findAll({
                where: {
                    userId: req.userId
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get news by ID
export const getNewsById = async (req, res) => {
    try {
        const news = await News.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!news) return res.status(404).json({msg: "Berita tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await News.findOne({
                where: {
                    id: news.id
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            response = await News.findOne({
                where: {
                    [Op.and]: [{id: news.id}, {userId: req.userId}]
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create news
export const createNews = async (req, res) => {
    const { nama, deskripsi, status } = req.body; // Tambahkan status
    const gambar = req.file ? req.file.path : null;

    // Validasi status
    if (!['guest', 'user'].includes(status)) {
        return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
    }

    try {
        const newNews = await News.create({
            nama,
            deskripsi,
            gambar,
            status,
            userId: req.userId
        });

        const newsWithDetails = await News.findOne({
            where: { id: newNews.id },
            include: [{
                model: Users,
                attributes: ['name', 'email', 'role']
            }]
        });

        res.status(201).json(newsWithDetails);
    } catch (error) {
        if (gambar) {
            fs.unlink(gambar, (err) => {
                if (err) console.error('Gagal menghapus file gambar:', err);
            });
        }
        res.status(500).json({ message: error.message });
    }
};


// Update news
export const updateNews = async (req, res) => {
    try {
        const news = await News.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!news) return res.status(404).json({ msg: "Berita tidak ditemukan" });

        const { nama, deskripsi, status } = req.body;
        const gambarBaru = req.file ? req.file.path : news.gambar;

        // Validasi status
        if (status && !['guest', 'user'].includes(status)) {
            return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
        }

        if (req.role === "admin" || req.userId === news.userId) {
            // Hapus gambar lama jika ada gambar baru
            if (req.file && news.gambar) {
                fs.unlink(news.gambar, (err) => {
                    if (err) console.error('Gagal menghapus gambar lama:', err);
                });
            }

            await News.update({
                nama: nama || news.nama,
                deskripsi: deskripsi || news.deskripsi,
                gambar: gambarBaru,
                status: status || news.status
            }, {
                where: {
                    id: news.id
                }
            });

            const updatedNews = await News.findOne({
                where: { id: news.id },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });

            res.status(200).json(updatedNews);
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }
    } catch (error) {
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Gagal menghapus gambar baru:', err);
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete news
export const deleteNews = async (req, res) => {
    try {
        const news = await News.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!news) return res.status(404).json({msg: "Berita tidak ditemukan"});

        if(req.role === "admin" || req.userId === news.userId){
            if (news.gambar) {
                fs.access(news.gambar, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(news.gambar, (unlinkErr) => {
                            if (unlinkErr) console.error('Gagal menghapus file:', unlinkErr);
                        });
                    }
                });
            }

            await News.destroy({
                where: {
                    id: news.id
                }
            });

            res.status(200).json({msg: "Berita berhasil dihapus"});
        } else {
            return res.status(403).json({msg: "Akses terlarang"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};