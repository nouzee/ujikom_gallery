import express from "express";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, getWebCategories, getWebCategoryById } from '../controllers/Category.js';
import { verifyUser } from "../middleware/AuthUser.js";
import { verifyLogin } from "../middleware/AuthUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

//Categories Route
router.get('/api/webcategories', verifyLogin, getWebCategories);
router.get('/api/webcategories/:id', verifyLogin, getWebCategoryById);

router.get('/api/categories', verifyUser, getCategories);
router.get('/api/categories/:id', verifyUser, getCategoryById);

router.post('/api/categories', verifyUser, verifyToken, createCategory);
router.patch('/api/categories/:id', verifyUser, verifyToken, updateCategory);
router.delete('/api/categories/:id', verifyUser, verifyToken, deleteCategory);

export default router;