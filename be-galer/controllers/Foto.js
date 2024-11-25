// controllers/Foto.js

import Foto from '../models/FotoModel.js';
import Users from '../models/UsersModel.js';
import Album from '../models/AlbumModel.js';
import fs from 'fs';
import { Op } from 'sequelize';

// Get all Fotos
export const getWebFotos = async (req, res) => {
    try {
        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat foto dengan status "guest" dan "user"
            response = await Foto.findAll({
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
                        model: Album,
                        attributes: ['nama']
                    }
                ]
            });
        } else {
            // Guest hanya dapat melihat foto dengan status "guest"
            response = await Foto.findAll({
                where: { status: 'guest' },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Album,
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

// Get Foto by ID
export const getWebFotoById = async (req, res) => {
    try {
        const foto = await Foto.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Users,
                    attributes: ['name', 'email', 'role']
                },
                {
                    model: Album,
                    attributes: ['nama']
                }
            ]
        });

        if (!foto) return res.status(404).json({ msg: "Foto tidak ditemukan" });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat foto dengan status "guest" dan "user"
            if (['guest', 'user'].includes(foto.status)) {
                response = foto;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke foto ini" });
            }
        } else {
            // Guest hanya dapat melihat foto dengan status "guest"
            if (foto.status === "guest") {
                response = foto;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke foto ini" });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Fotos by Album ID
export const getWebFotosByAlbumId = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.albumId
            }
        });

        if (!album) return res.status(404).json({ msg: "Album tidak ditemukan" });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat foto dalam album dengan status "guest" dan "user"
            response = await Foto.findAll({
                where: {
                    albumId: req.params.albumId,
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
                        model: Album,
                        attributes: ['id', 'nama']
                    }
                ]
            });
        } else {
            // Guest hanya dapat melihat foto dalam album dengan status "guest"
            response = await Foto.findAll({
                where: {
                    albumId: req.params.albumId,
                    status: 'guest'
                },
                include: [
                    {
                        model: Users,
                        attributes: ['name', 'email', 'role']
                    },
                    {
                        model: Album,
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



// Get all Fotos
export const getFotos = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Foto.findAll({
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Album, 
                        attributes: ['nama'] 
                    }
                ]
            });
        } else {
            response = await Foto.findAll({
                where: {
                    userId: req.userId
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Album, 
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

// Get Foto by ID
export const getFotoById = async (req, res) => {
    try {
        const foto = await Foto.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!foto) return res.status(404).json({msg: "Foto tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Foto.findOne({
                attributes:['id', 'nama', 'deskripsi', 'gambar'],
                where: {
                    id: foto.id
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Album, 
                        attributes: ['nama'] 
                    }
                ]
            });
        } else {
            response = await Foto.findOne({
                attributes:['id', 'nama', 'deskripsi', 'gambar'],
                where: {
                    [Op.and]: [{id: foto.id}, {userId: req.userId}]
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Album, 
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

// Create Foto
export const createFoto = async (req, res) => {
    const { nama, deskripsi, albumId, status } = req.body;
    const gambar = req.file ? req.file.path : null;

    // Validasi status
    if (!['guest', 'user'].includes(status)) {
        return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
    }

    try {
        const newFoto = await Foto.create({
            nama,
            deskripsi,
            gambar,
            userId: req.userId,
            albumId,
            status
        });

        const fotoWithDetails = await Foto.findOne({
            where: { id: newFoto.id },
            include: [
                { 
                    model: Users, 
                    attributes: ['name', 'email'] 
                },
                { 
                    model: Album, 
                    attributes: ['nama'] 
                }
            ]
        });

        res.status(201).json(fotoWithDetails);
    } catch (error) {
        if (gambar) {
            fs.unlink(gambar, (err) => {
                if (err) console.error('Gagal menghapus file gambar:', err);
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Update Foto
export const updateFoto = async (req, res) => {
    try {
        const foto = await Foto.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!foto) return res.status(404).json({ msg: "Foto tidak ditemukan" });

        const { nama, deskripsi, albumId, status } = req.body;
        const gambarBaru = req.file ? req.file.path : foto.gambar;

        // Validasi status jika diperbarui
        if (status && !['guest', 'user'].includes(status)) {
            return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
        }

        if (req.role === "admin" || req.userId === foto.userId) {
            // Hapus gambar lama jika ada gambar baru
            if (req.file && foto.gambar) {
                fs.unlink(foto.gambar, (err) => {
                    if (err) console.error('Gagal menghapus gambar lama:', err);
                });
            }

            await Foto.update({
                nama: nama || foto.nama,
                deskripsi: deskripsi || foto.deskripsi,
                gambar: gambarBaru,
                albumId: albumId || foto.albumId,
                status: status || foto.status
            }, {
                where: {
                    id: foto.id
                }
            });

            const updatedFoto = await Foto.findOne({
                where: { id: foto.id },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email'] 
                    },
                    { 
                        model: Album, 
                        attributes: ['nama'] 
                    }
                ]
            });

            res.status(200).json(updatedFoto);
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


// Delete Foto
export const deleteFoto = async (req, res) => {
    try {
        const foto = await Foto.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!foto) return res.status(404).json({msg: "Foto tidak ditemukan"});

        if(req.role === "admin" || req.userId === foto.userId){
            if (foto.gambar) {
                fs.access(foto.gambar, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(foto.gambar, (unlinkErr) => {
                            if (unlinkErr) console.error('Gagal menghapus file:', unlinkErr);
                        });
                    }
                });
            }

            await Foto.destroy({
                where: {
                    id: foto.id
                }
            });

            res.status(200).json({msg: "Foto berhasil dihapus"});
        } else {
            return res.status(403).json({msg: "Akses terlarang"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Fotos by Album ID
export const getFotosByAlbumId = async (req, res) => {
    try {
        const album = await Album.findOne({
            where: {
                id: req.params.albumId
            }
        });
        
        if(!album) return res.status(404).json({msg: "Album tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Foto.findAll({
                where: {
                    albumId: req.params.albumId
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Album, 
                        attributes: ['id', 'nama'] 
                    }
                ]
            });
        } else {
            response = await Foto.findAll({
                where: {
                    [Op.and]: [
                        { albumId: req.params.albumId },
                        { userId: req.userId }
                    ]
                },
                include: [
                    { 
                        model: Users, 
                        attributes: ['name', 'email', 'role'] 
                    },
                    { 
                        model: Album, 
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
