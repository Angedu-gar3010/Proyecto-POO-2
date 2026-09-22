import { body } from 'express-validator';
import User from '../../src/user/user.model.js';
import { USER_PROFILE_VALUES } from '../../src/user/user.constants.js';

export const registerValidator = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('El nombre es obligatorio')
    .bail()
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('username')
    .exists({ values: 'falsy' })
    .withMessage('El nombre de usuario es obligatorio')
    .bail()
    .isString()
    .withMessage('El usuario debe ser texto')
    .trim()
    .toLowerCase()
    .isLength({ min: 4, max: 20 })
    .withMessage('El usuario debe tener entre 4 y 20 caracteres')
    .matches(/^[a-z0-9._-]+$/)
    .withMessage(
      'El usuario solo puede contener letras, números, puntos, guiones y guion bajo'
    )
    .custom(async (username) => {
      const userExists = await User.exists({ username });

      if (userExists) {
        throw new Error('El nombre de usuario ya está registrado');
      }

      return true;
    }),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('La contraseña es obligatoria')
    .bail()
    .isString()
    .withMessage('La contraseña debe ser texto')
    .isLength({ min: 8, max: 64 })
    .withMessage('La contraseña debe tener entre 8 y 64 caracteres')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0
    })
    .withMessage(
      'La contraseña debe contener mayúscula, minúscula y número'
    ),

  body('profile')
    .optional()
    .isIn(USER_PROFILE_VALUES)
    .withMessage('El perfil seleccionado no es válido'),

  body('role')
    .not()
    .exists()
    .withMessage('El rol no puede asignarse durante el registro')
];

export const loginValidator = [
  body('username')
    .exists({ values: 'falsy' })
    .withMessage('El nombre de usuario es obligatorio')
    .bail()
    .isString()
    .withMessage('El usuario debe ser texto')
    .trim()
    .toLowerCase(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('La contraseña es obligatoria')
    .bail()
    .isString()
    .withMessage('La contraseña debe ser texto')
];