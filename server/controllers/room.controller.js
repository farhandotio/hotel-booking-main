import hotelModel from '../models/hotel.model.js';
import { v2 as cloudinary } from 'cloudinary';
import roomModel from '../models/room.model.js';

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    // Check koren req.auth.userId thik ache kina (Clerk use korle thik thakar kotha)
    const hotel = await hotelModel.findOne({ owner: req.auth.userId });

    if (!hotel) {
      return res.json({ success: false, message: 'No Hotel Found for this owner' });
    }

    // Images upload logic fix (req.files check kora dorkar)
    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: 'Please upload at least one image' });
    }

    const uploadImages = req.files.map(async (file) => {
      // Cloudinary upload (folder specify kora bhalo)
      const response = await cloudinary.uploader.upload(file.path, { resource_type: 'image' });
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    // Create Room
    const newRoom = await roomModel.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: Number(pricePerNight), // + sign er bodole Number use kora safer
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({
      success: true,
      message: 'Room created successfully',
      room: newRoom,
    });
  } catch (error) {
    console.log(error); // Debugging er jonno
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    // Vul: await hotelModel({ owner: ... }) chilo, eita findOne hobe
    const hotelData = await hotelModel.findOne({ owner: req.auth.userId });

    if (!hotelData) {
      return res.json({ success: false, message: 'Hotel not found' });
    }

    const rooms = await roomModel
      .find({ hotel: hotelData._id }) // toString() lagbe na
      .populate('hotel');

    res.json({ success: true, rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await roomModel
      .find({ isAisAvailable: true })
      .populate({
        path: 'hotel',
        populate: {
          path: 'owner',
          select: 'image',
        },
      })
      .sort({ createdAt: -1 });
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

    res.json({ success: true, message: 'Room availability updated' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
