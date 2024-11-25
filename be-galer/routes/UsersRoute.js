import express from "express";
// import { verifyToken } from "../middleware/VerifyToken.js";
// import { refreshToken } from "../controllers/RefreshToken.js";
// import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";


const router = express.Router();

// router.get('/api/users', verifyToken, getUsers);
// router.post('/api/users', Register);
// router.post('/api/login', Login);
// router.get('/api/token', refreshToken);
// router.delete('/api/logout', Logout);
router.get('/api/users', verifyUser, adminOnly, getUsers);
router.get('/api/users/:id', verifyUser, adminOnly, getUserById);
router.post('/api/users', verifyUser, adminOnly, createUser);
router.patch('/api/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/api/users/:id', verifyUser, adminOnly, deleteUser);

export default router;