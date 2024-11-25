import express from "express";
import { getNews, getNewsById, createNews, updateNews, deleteNews, getWebNews, getWebNewsById } from "../controllers/News.js";
import { uploadNews } from "../config/multer.js";
import { verifyUser } from "../middleware/AuthUser.js";
import { verifyLogin } from "../middleware/AuthUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";


const router = express.Router();

router.get('/api/webnews', verifyLogin, getWebNews);
router.get('/api/webnews/:id', verifyLogin, getWebNewsById);

router.get('/api/news', verifyUser, getNews);
router.get('/api/news/:id', verifyUser, getNewsById);

router.post('/api/news', verifyUser, verifyToken, uploadNews, createNews);
router.patch('/api/news/:id', verifyUser, verifyToken, uploadNews, updateNews);
router.delete('/api/news/:id', verifyUser, verifyToken, deleteNews);

export default router;