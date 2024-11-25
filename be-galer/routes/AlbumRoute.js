import express from "express";
import { createAlbum, updateAlbum, getAlbums, getAlbumById, deleteAlbum, getWebAlbums, getWebAlbumById, getAlbumsByCategoryId} from '../controllers/Album.js';
import { uploadCover } from '../config/multer.js';
import { verifyUser } from "../middleware/AuthUser.js";
import { verifyLogin } from "../middleware/AuthUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

//Album Route
router.post('/api/albums', verifyUser, verifyToken, uploadCover, createAlbum);
router.patch('/api/albums/:id', verifyUser, verifyToken, uploadCover, updateAlbum);
router.delete('/api/albums/:id', verifyUser, verifyToken, deleteAlbum);

router.get('/api/albums', verifyUser, getAlbums);
router.get('/api/albums/:id', verifyUser, getAlbumById);

router.get('/api/categories/:categoryId/albums', verifyLogin, getAlbumsByCategoryId);
router.get('/api/webalbums', verifyLogin, getWebAlbums);
router.get('/api/webalbums/:id', verifyLogin, getWebAlbumById);

export default router;