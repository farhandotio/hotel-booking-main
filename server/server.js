import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import { clerkMiddleware } from "@clerk/express";
import clerkWebhook from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";

connectDB();
connectCloudinary()

const app = express();
app.use(cors());

// middleware
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/clerk", clerkWebhook);

app.get("/", (req, res) => {
  res.send("API is working!");
});
app.use("/api/user", userRouter)
app.use("/api/hotel", hotelRouter)
app.use("/api/room", roomRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
