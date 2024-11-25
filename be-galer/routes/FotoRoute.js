import express from "express";
import { createFoto, getFotos, getFotoById, updateFoto, deleteFoto, getFotosByAlbumId, getWebFotos, getWebFotoById, getWebFotosByAlbumId } from '../controllers/Foto.js';
import { uploadPhoto } from '../config/multer.js';
import { verifyUser } from "../middleware/AuthUser.js";
import { verifyLogin } from "../middleware/AuthUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Rute Foto (menggunakan uploadPhoto untuk foto dalam album)

router.get('/api/webfotos', verifyLogin, getWebFotos);
router.get('/api/webfotos/:id', verifyLogin, getWebFotoById);
router.get('/api/webalbums/:albumId/webfotos', verifyLogin, getWebFotosByAlbumId);

router.get('/api/fotos', verifyUser, getFotos);
router.get('/api/fotos/:id', verifyUser, getFotoById);
router.get('/api/albums/:albumId/fotos', verifyUser, getFotosByAlbumId);

router.patch('/api/fotos/:id', verifyUser, verifyToken, uploadPhoto, updateFoto);
router.post('/api/fotos', verifyUser, verifyToken, uploadPhoto, createFoto);
router.delete('/api/fotos/:id', verifyUser, verifyToken, deleteFoto);

export default router;