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

