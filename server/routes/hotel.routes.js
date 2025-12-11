import express from "express"
import { registerHotel } from "../controllers/hotel.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const hotelRouter = express.Router()

hotelRouter.post("/", protect, registerHotel)

export default hotelRouter