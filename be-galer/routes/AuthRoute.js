import express from "express";
import { Login, Logout, Me } from "../controllers/Auth.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyUser } from "../middleware/AuthUser.js";


const router = express.Router();

router.get('/api/me', Me);
router.post('/api/login', Login);
router.delete('/api/logout', Logout);
router.get('/api/token', verifyUser, refreshToken);

export default router;