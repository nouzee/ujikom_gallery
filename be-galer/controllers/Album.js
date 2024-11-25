// controllers/AlbumController.js
import fs from 'fs';
import Album from '../models/AlbumModel.js';
import Users from '../models/UsersModel.js';
import Category from '../models/CategoryModel.js';
import { Op } from 'sequelize';

// Get all albums
export const getWebAlbums = async (req, res) => {
    try {
        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat album dengan status "guest" dan "user"
            response = await Album.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt'],
                where: {
                    status: {
                        [Op.or]: ['guest', 'user']
                    }
                },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Category,
                        attributes: ['nama']
                    }
                ]
            });
        } else {
            // Guest hanya dapat melihat album dengan status "guest"
            response = await Album.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt'],
                where: { status: 'guest' },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Category,
                        attributes: ['nama']
                    }
                ]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get album by ID
export const getWebAlbumById = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt', 'status'],
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email', 'role']
                },
                {
                    model: Category,
                    attributes: ['nama']
                }
            ]
        });

        if (!album) return res.status(404).json({ msg: "Album tidak ditemukan" });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat album dengan status "guest" dan "user"
            if (['guest', 'user'].includes(album.status)) {
                response = album;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke album ini" });
            }
        } else {
            // Guest hanya dapat melihat album dengan status "guest"
            if (album.status === "guest") {
                response = album;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke album ini" });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Albums by Category ID
export const getAlbumsByCategoryId = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.categoryId
            }
        });

        // Jika kategori tidak ditemukan
        if (!category) return res.status(404).json({ msg: "Kategori tidak ditemukan." });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat album dengan status "guest" dan "user"
            response = await Album.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'status', 'createdAt'],
                where: {
                    categoryId: req.params.categoryId,
                    status: {
                        [Op.or]: ['guest', 'user']
                    }
                },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Category,
                        attributes: ['id', 'nama']
                    }
                ]
            });
        } else {
            // Guest hanya dapat melihat album dengan status "guest"
            response = await Album.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'status', 'createdAt'],
                where: {
                    categoryId: req.params.categoryId,
                    status: 'guest'
                },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Category,
                        attributes: ['id', 'nama']
                    }
                ]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






// dibawah ini untuk halaman manajemen





// Get all albums
export const getAlbums = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Album.findAll({
                attributes:['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt', 'status'],
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Category, 
                        attributes: ['nama'] 
                    }
                ]
            });
        } else {
            response = await Album.findAll({
                attributes:['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt', 'status'],
                where: {
                    userId: req.userId
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Category, 
                        attributes: ['nama'] 
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get album by ID
export const getAlbumById = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!album) return res.status(404).json({msg: "Album tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Album.findOne({
                attributes:['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt', 'status'],
                where: {
                    id: album.id
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Category, 
                        attributes: ['nama'] 
                    }
                ]
            });
        } else {
            response = await Album.findOne({
                attributes:['id', 'uuid', 'nama', 'deskripsi', 'gambar', 'createdAt', 'status'],
                where: {
                    [Op.and]: [{id: album.id}, {userId: req.userId}]
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Category, 
                        attributes: ['nama'] 
                    }
                ]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create album
export const createAlbum = async (req, res) => {
    const { nama, deskripsi, categoryId, status } = req.body;
    const gambar = req.file ? req.file.path : null;

    // Validasi status
    if (!['guest', 'user'].includes(status)) {
        return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
    }

    try {
        const newAlbum = await Album.create({
            nama,
            deskripsi,
            gambar,
            userId: req.userId,
            categoryId,
            status
        });

        const albumWithDetails = await Album.findOne({
            where: { id: newAlbum.id },
            include: [
                { 
                    model: Users, 
                    attributes: ['name', 'email'] 
                },
                { 
                    model: Category, 
                    attributes: ['nama'] 
                }
            ]
        });

        res.status(201).json(albumWithDetails);
    } catch (error) {
        if (gambar) {
            fs.unlink(gambar, (err) => {
                if (err) console.error('Gagal menghapus file gambar:', err);
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update album
export const updateAlbum = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!album) return res.status(404).json({ msg: "Album tidak ditemukan" });

        const { nama, deskripsi, categoryId, status } = req.body;
        const gambarBaru = req.file ? req.file.path : album.gambar;

        // Validasi status jika diperbarui
        if (status && !['guest', 'user'].includes(status)) {
            return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
        }

        if (req.role === "admin" || req.userId === album.userId) {
            // Hapus gambar lama jika ada gambar baru
            if (req.file && album.gambar) {
                fs.unlink(album.gambar, (err) => {
                    if (err) console.error('Gagal menghapus gambar lama:', err);
                });
            }

            await Album.update({
                nama: nama || album.nama,
                deskripsi: deskripsi || album.deskripsi,
                gambar: gambarBaru,
                categoryId: categoryId || album.categoryId,
                status: status || album.status
            }, {
                where: {
                    id: album.id
                }
            });

            const updatedAlbum = await Album.findOne({
                where: { id: album.id },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Category, 
                        attributes: ['nama'] 
                    }
                ]
            });

            res.status(200).json(updatedAlbum);
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


// Delete album
export const deleteAlbum = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!album) return res.status(404).json({msg: "Album tidak ditemukan"});

        if(req.role === "admin" || req.userId === album.userId){
            if (album.gambar) {
                fs.access(album.gambar, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(album.gambar, (unlinkErr) => {
                            if (unlinkErr) console.error('Gagal menghapus file:', unlinkErr);
                        });
                    }
                });
            }

            await Album.destroy({
                where: {
                    id: album.id
                }
            });

            res.status(200).json({msg: "Album berhasil dihapus"});
        } else {
            return res.status(403).json({msg: "Akses terlarang"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
