import hotelModel from "../models/hotel.model.js";
import { v2 as cloudinary } from "cloudinary";
import roomModel from "../models/room.model.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await hotelModel.findOne({ owner: req.auth.userId });

    if (!hotel) return res.json({ success: false, message: "No Hotel Found" });

    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);

      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await roomModel.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({
      success: true,
      message: "Room created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel
      .find({ isAisAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await hotelModel({ owner: req.auth.userId });
    const rooms = await roomModel
      .find({ hotel: hotelData._id.toString() })
      .populate("hotel");

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await roomModel.findById(roomId);
    roomData.isAisAvailable = !roomData.isAisAvailable;

    await roomData.save();

    res.json({ success: true, message: "Room availability updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
