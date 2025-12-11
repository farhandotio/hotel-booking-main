import userModel from '../models/user.model.js';

export const protect = async (req, res, next) => {
  const { userId } = req.auth;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'not authenticated' });
  } else {
    const user = await userModel.findOne(userId);
    req.user = user;
    next();
  }
};
