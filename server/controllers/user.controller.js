import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

/** REGISTER */
export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    // Cloudinary upload
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'hotel_users',
    });

    // Model-er pre-save hook auto-hash korbe
    const user = await userModel.create({
      username,
      email,
      password,
      image: uploadResponse.secure_url,
      role: role || 'user',
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

    return res.status(201).json({ success: true, message: 'User created', user });
  } catch (err) {
    console.error('Register Error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** LOGIN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // select('+password') proyojon karon model-e eita default-e false deya
    const user = await userModel.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Password remove kore deya response pathanor agey
    user.password = undefined;

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** GET USER DATA */
export const getUserData = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/** LOGOUT */
export const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });
  res.status(200).json({ success: true, message: 'Logged out' });
};

/** RECENT SEARCH */
export const storeRecentSearchCities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = await userModel.findById(req.user.id);

    if (!user.recentSearchedCities.includes(recentSearchedCity)) {
      if (user.recentSearchedCities.length >= 3) user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
      await user.save();
    }
    res.status(200).json({ success: true, cities: user.recentSearchedCities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
