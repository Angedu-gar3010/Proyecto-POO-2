import { body, param } from 'express-validator';

const allowedFields = ['number', 'name', 'description', 'requiredScore', 'active'];

export const levelIdValidator = [
  param('id').isMongoId().withMessage('El identificador del nivel no es válido')
];

export const createLevelValidator = [
  body('number').isInt({ min: 1 }).withMessage('El número debe ser un entero mayor que cero').toInt(),
  body('name').isString().trim().isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  body('description').isString().trim().isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('requiredScore').optional().isInt({ min: 0 }).withMessage('El puntaje requerido debe ser un entero no negativo').toInt(),
  body('active').optional().isBoolean().withMessage('active debe ser booleano').toBoolean(),
  body().custom((value) => {
    const invalid = Object.keys(value).filter((field) => !allowedFields.includes(field));
    if (invalid.length) throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    return true;
  })
];

export const updateLevelValidator = [
  ...levelIdValidator,
  body().custom((value) => {
    const fields = Object.keys(value);
    if (!fields.length) throw new Error('Debes enviar al menos un campo');
    const invalid = fields.filter((field) => !allowedFields.includes(field));
    if (invalid.length) throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    return true;
  }),
  body('number').optional().isInt({ min: 1 }).withMessage('El número debe ser un entero mayor que cero').toInt(),
  body('name').optional().isString().trim().isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres'),
  body('description').optional().isString().trim().isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('requiredScore').optional().isInt({ min: 0 }).withMessage('El puntaje requerido debe ser un entero no negativo').toInt(),
  body('active').optional().isBoolean().withMessage('active debe ser booleano').toBoolean()
];
