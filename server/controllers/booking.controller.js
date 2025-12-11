import bookingModel from '../models/booking.model.js';
import hotelModel from '../models/hotel.model.js';
import roomModel from '../models/room.model.js';

const checkAvaivalability = async (checkInDate, checkOutDate, room) => {
  try {
    const bookings = await bookingModel.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message);
  }
};

export const checkAvaivalabilityAPI = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room } = req.body;
    const isAvailable = await checkAvaivalability({ checkInDate, checkOutDate, room });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, room, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvaivalability({ checkInDate, checkOutDate, room });

    if (!isAvailable) {
      return res.json({ success: false, message: 'Room is not available' });
    }

    const roomData = await roomModel.findById(room).populate('hotel');
    let totalPrice = roomData.pricePerNight;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await bookingModel.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    res.json({ success: true, message: 'Booking created successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Failed to create booking' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await bookingModel
      .find({ user })
      .populate('room hotel')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: true, message: 'Failes to fetch bookings' });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await hotelModel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: 'No Hotel found' });
    }

    const bookings = await bookingModel
      .find({ hotel: hotel._id })
      .populate('hotel user')
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: true, message: 'Failes to fetch bookings' });
  }
};
