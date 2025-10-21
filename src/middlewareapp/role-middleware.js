import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function rolemiddle(roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      return next();
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(400).json({ message: 'User is not authorized' });
      }
      const { roles: roles } = jwt.verify(token, process.env.JWT_SECRET);
      let hasRole = false;
      userRoles.Array.forEach((role) => {
        if (roles.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(400).json({ message: 'Have not access' });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'User is not authorized' });
    }
  };
}
