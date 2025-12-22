import hotelModel from "../models/hotel.model.js";
import userModel from "../models/user.model.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    const hotel = await hotelModel.findOne({ owner });
    if (hotel) {
      return res.json({
        succes: false,
        message: "Hotel Already Registered",
      });
    }

    await hotelModel.create({
      name,
      address,
      contact,
      city,
      owner,
    });

    await userModel.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.json({
      succes: true,
      message: "Hotel Registered Successfully",
    });
  } catch (error) {
    res.json({
      succes: false,
      message: error.message,
    });
  }
};
