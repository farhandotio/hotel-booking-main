import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/user.routes.js';
import hotelRouter from './routes/hotel.routes.js';
import roomRouter from './routes/room.routes.js';
import cookieParser from 'cookie-parser';

connectDB();
connectCloudinary();

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// middleware
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is working!');
});
app.use('/api/auth', userRouter);
app.use('/api/hotel', hotelRouter);
app.use('/api/room', roomRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
