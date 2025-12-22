import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const protect = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ message: 'No token provided. Unauthorized.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(payload.id)

    if (!user) return res.status(401).json({ message: 'User not found.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.'});
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Access denied. Admins only.' });

  next();
};

export const isUser = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
  if (req.user.role !== 'user')
    return res.status(403).json({ message: 'Access denied. Users only.' });

  next();
};
