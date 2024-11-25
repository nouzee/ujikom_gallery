import Events from "../models/EventModel.js";
import Users from "../models/UsersModel.js";
import fs from 'fs';
import { Op } from 'sequelize';

// Get all events
export const getWebEvents = async (req, res) => {
    try {
        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat semua event dengan status "guest" dan "user"
            response = await Events.findAll({
                where: {
                    status: {
                        [Op.or]: ['guest', 'user']
                    }
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            // Guest hanya dapat melihat event dengan status "guest"
            response = await Events.findAll({
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

// Get event by ID
export const getWebEventById = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Users,
                attributes: ['name', 'email', 'role']
            }]
        });

        if (!event) return res.status(404).json({ msg: "Event tidak ditemukan" });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat event dengan status "guest" dan "user"
            if (['guest', 'user'].includes(event.status)) {
                response = event;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke event ini" });
            }
        } else {
            // Guest hanya dapat melihat event dengan status "guest"
            if (event.status === "guest") {
                response = event;
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke event ini" });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// dibawah ini untuk halaman manajemen



// Get all events
export const getEvents = async (req, res) => {
    try {
        let response;
        if(req.role === "admin"){
            response = await Events.findAll({
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            response = await Events.findAll({
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

// Get event by ID
export const getEventById = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!event) return res.status(404).json({msg: "Event tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Events.findOne({
                where: {
                    id: event.id
                },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });
        } else {
            response = await Events.findOne({
                where: {
                    [Op.and]: [{id: event.id}, {userId: req.userId}]
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

// Create event
export const createEvent = async (req, res) => {
    const { nama, deskripsi, status } = req.body; // Tambahkan status
    const gambar = req.file ? req.file.path : null;

    // Validasi status
    if (!['guest', 'user'].includes(status)) {
        return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
    }

    try {
        const newEvent = await Events.create({
            nama,
            deskripsi,
            gambar,
            status,
            userId: req.userId
        });

        const eventWithDetails = await Events.findOne({
            where: { id: newEvent.id },
            include: [{
                model: Users,
                attributes: ['name', 'email', 'role']
            }]
        });

        res.status(201).json(eventWithDetails);
    } catch (error) {
        if (gambar) {
            fs.unlink(gambar, (err) => {
                if (err) console.error('Gagal menghapus file gambar:', err);
            });
        }
        res.status(500).json({ message: error.message });
    }
};


// Update event
export const updateEvent = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!event) return res.status(404).json({ msg: "Event tidak ditemukan" });

        const { nama, deskripsi, status } = req.body;
        const gambarBaru = req.file ? req.file.path : event.gambar;

        // Validasi status
        if (status && !['guest', 'user'].includes(status)) {
            return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
        }

        if (req.role === "admin" || req.userId === event.userId) {
            // Hapus gambar lama jika ada gambar baru
            if (req.file && event.gambar) {
                fs.unlink(event.gambar, (err) => {
                    if (err) console.error('Gagal menghapus gambar lama:', err);
                });
            }

            await Events.update({
                nama: nama || event.nama,
                deskripsi: deskripsi || event.deskripsi,
                gambar: gambarBaru,
                status: status || event.status
            }, {
                where: {
                    id: event.id
                }
            });

            const updatedEvent = await Events.findOne({
                where: { id: event.id },
                include: [{
                    model: Users,
                    attributes: ['name', 'email', 'role']
                }]
            });

            res.status(200).json(updatedEvent);
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


// Delete event
export const deleteEvent = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!event) return res.status(404).json({msg: "Event tidak ditemukan"});

        if(req.role === "admin" || req.userId === event.userId){
            if (event.gambar) {
                fs.access(event.gambar, fs.constants.F_OK, (err) => {
                    if (!err) {
                        fs.unlink(event.gambar, (unlinkErr) => {
                            if (unlinkErr) console.error('Gagal menghapus file:', unlinkErr);
                        });
                    }
                });
            }

            await Events.destroy({
                where: {
                    id: event.id
                }
            });

            res.status(200).json({msg: "Event berhasil dihapus"});
        } else {
            return res.status(403).json({msg: "Akses terlarang"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};