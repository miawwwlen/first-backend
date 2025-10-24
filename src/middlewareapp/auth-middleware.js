import { validate } from 'class-validator';

export function validateDTO(DTOClass) {
  return async (req, res, next) => {
    const dto = new DTOClass(req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }
    req.dto = dto;
    next();
  };
}

export function isAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export function roleAdmin(req, res, next) {
  const user = req.session.user;
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}
