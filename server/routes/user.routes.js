import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getUserData,
  login,
  logout,
  register,
  storeRecentSearchCities,
} from '../controllers/user.controller.js';
import upload from '../middleware/upload.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', upload.single('image'), register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.get('/me', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSearchCities);

export default userRouter;
