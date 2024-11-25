// controllers/CategoryController.js
import Users from '../models/UsersModel.js';
import Category from '../models/CategoryModel.js';
import { Op } from 'sequelize';

// Get all categories
export const getWebCategories = async (req, res) => {
    try {
        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat kategori dengan status "guest" dan "user"
            response = await Category.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'status', 'createdAt'],
                where: {
                    status: {
                        [Op.or]: ['guest', 'user']
                    }
                },
                include: [{
                    attributes: ['name', 'email'],
                    model: Users
                }]
            });
        } else {
            // Guest hanya dapat melihat kategori dengan status "guest"
            response = await Category.findAll({
                attributes: ['id', 'uuid', 'nama', 'deskripsi', 'status', 'createdAt'],
                where: {
                    status: 'guest'
                },
                include: [{
                    attributes: ['name', 'email'],
                    model: Users
                }]
            });
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a category by ID
export const getWebCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!category) return res.status(404).json({ msg: "Kategori tidak ditemukan." });

        let response;

        if (req.role === "admin" || req.role === "user") {
            // Admin dan User dapat melihat kategori dengan status "guest" dan "user"
            if (['guest', 'user'].includes(category.status)) {
                response = await Category.findOne({
                    attributes: ['id', 'uuid', 'nama', 'deskripsi', 'status', 'createdAt'],
                    where: {
                        id: category.id
                    },
                    include: [{
                        attributes: ['name', 'email'],
                        model: Users
                    }]
                });
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke kategori ini." });
            }
        } else {
            // Guest hanya dapat melihat kategori dengan status "guest"
            if (category.status === "guest") {
                response = await Category.findOne({
                    attributes: ['id', 'uuid', 'nama', 'deskripsi', 'status', 'createdAt'],
                    where: {
                        id: category.id
                    },
                    include: [{
                        attributes: ['name', 'email'],
                        model: Users
                    }]
                });
            } else {
                return res.status(403).json({ msg: "Anda tidak memiliki akses ke kategori ini." });
            }
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// dibawah ini untuk halaman manajemen





// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'uuid', 'nama', 'deskripsi', 'createdAt', 'status'],
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        });

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'uuid', 'nama', 'deskripsi', 'createdAt', 'status'],
            include: [{
                attributes: ['name', 'email'],
                model: Users
            }]
        });

        if (!category) {
            return res.status(404).json({ msg: "Data tidak ditemukan." });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Create a new category
export const createCategory = async (req, res) => {
    const { nama, deskripsi, status } = req.body;

    // Validasi status
    if (!['guest', 'user'].includes(status)) {
        return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
    }

    try { 
        await Category.create({
            nama,
            deskripsi,
            userId: req.userId,
            status
        });
        res.status(201).json({ msg: "Berhasil membuat kategori!" });
    } catch (error) {
        res.status(400).json({ msg: "Isi nama, deskripsi, dan status dengan benar!" });
    }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!category) return res.status(404).json({ msg: "Data tidak ditemukan." });

        const { nama, deskripsi, status } = req.body;

        // Validasi status jika diperbarui
        if (status && !['guest', 'user'].includes(status)) {
            return res.status(400).json({ msg: 'Status harus "guest" atau "user"' });
        }

        if (req.role === "admin") {
            await Category.update(
                { nama, deskripsi, status },
                { where: { id: category.id } }
            );
        } else {
            if (req.userId !== category.userId) {
                return res.status(403).json({ msg: "Admin only." });
            }
            await Category.update(
                { nama, deskripsi, status },
                {
                    where: {
                        [Op.and]: [{ id: category.id }, { userId: req.userId }]
                    }
                }
            );
        }

        res.status(200).json({ msg: "Category updated!" });
    } catch (error) {
        res.status(400).json({ msg: "Isi nama, deskripsi, dan status dengan benar!" });
    }
};


// Delete a category by ID
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOne({
            where:{
                uuid: req.params.id
            }
        });
        if(!category) return res.status(404).json({msg: "Data tidak ditemukan."});

        const { nama, deskripsi } = req.body;
        if(req.role === "admin"){
            await Category.destroy({
                where:{
                    id: category.id
                }
           });
        } else{
            if(req.userId !== category.userId) return res.status(403).json({msg: "admin only."});
            await Category.destroy({
                where:{
                    [Op.and]:[{id: category.id}, { userId: req.userId }]
                }
            });
        }
        res.status(200).json({msg: "Category Deleted!"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
