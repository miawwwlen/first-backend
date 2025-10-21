import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authmiddle(req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: 'User is not authorized' });
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'User is not authorized' });
  }
}
