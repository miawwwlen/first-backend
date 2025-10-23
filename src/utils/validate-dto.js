import { body } from 'class-validator';

export function registerUserDTO(dtoClass) {
  return (req, res, next) => {
    try {
      req.dto = new dtoClass(req.body);
      [
        body('username').isString().notEmpty(),
        body('password').isString().isLength({ min: 6 }),
        body('email').isEmail(),
      ];
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid data transfer object' });
    }
  };
}
