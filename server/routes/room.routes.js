// routes/room.routes.js
import express from 'express';
import upload from '../middleware/upload.middleware.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  createRoom,
  getOwnerRooms,
  getRooms,
  toggleRoomAvailability,
} from '../controllers/room.controller.js';

const roomRouter = express.Router();

// Order is important: multer first, then auth, then controller
roomRouter.post('/', upload.array('images', 4), protect, createRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect, getOwnerRooms);
roomRouter.post('/toggle-availability', protect, toggleRoomAvailability);

export default roomRouter;
