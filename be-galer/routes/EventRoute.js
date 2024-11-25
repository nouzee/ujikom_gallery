import express from "express";
import { 
    getEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getWebEvents,
    getWebEventById
} from "../controllers/Events.js";
import { uploadEvent } from "../config/multer.js";
import { verifyUser } from "../middleware/AuthUser.js";
import { verifyLogin } from "../middleware/AuthUser.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get('/api/webevents', verifyLogin, getWebEvents);
router.get('/api/webevents/:id', verifyLogin, getWebEventById);

router.get('/api/events', verifyUser, getEvents);
router.get('/api/events/:id', verifyUser, getEventById);

router.post('/api/events', verifyUser, verifyToken, uploadEvent, createEvent);
router.patch('/api/events/:id', verifyUser, verifyToken, uploadEvent, updateEvent);
router.delete('/api/events/:id', verifyUser, verifyToken, deleteEvent);

export default router;