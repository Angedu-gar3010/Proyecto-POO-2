import { body } from 'express-validator';
import User from '../../src/user/user.model.js';
import { USER_PROFILE_VALUES } from '../../src/user/user.constants.js';

const updateAllowedFields = [
  'name',
  'username',
  'profile'
];

export const updateUserValidator = [
  body().custom((requestBody) => {
    const receivedFields = Object.keys(requestBody);

    if (receivedFields.length === 0) {
      throw new Error('Debes enviar al menos un campo');
    }

    const invalidFields = receivedFields.filter(
      (field) => !updateAllowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      throw new Error(
        `No puedes actualizar estos campos: ${invalidFields.join(', ')}`
      );
    }

    return true;
  }),

  body('name')
    .optional()
    .isString()
    .withMessage('El nombre debe ser texto')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('username')
    .optional()
    .isString()
    .withMessage('El usuario debe ser texto')
    .trim()
    .toLowerCase()
    .isLength({ min: 4, max: 20 })
    .withMessage('El usuario debe tener entre 4 y 20 caracteres')
    .matches(/^[a-z0-9._-]+$/)
    .withMessage('El nombre de usuario contiene caracteres no permitidos')
    .custom(async (username, { req }) => {
      const userExists = await User.exists({
        username,
        _id: { $ne: req.user.id }
      });

      if (userExists) {
        throw new Error('El nombre de usuario ya está registrado');
      }

      return true;
    }),

  body('profile')
    .optional()
    .isIn(USER_PROFILE_VALUES)
    .withMessage('El perfil seleccionado no es válido')
];

export const updatePasswordValidator = [
  body('currentPassword')
    .exists({ values: 'falsy' })
    .withMessage('La contraseña actual es obligatoria')
    .bail()
    .isString()
    .withMessage('La contraseña actual debe ser texto'),

  body('newPassword')
    .exists({ values: 'falsy' })
    .withMessage('La contraseña nueva es obligatoria')
    .bail()
    .isString()
    .withMessage('La contraseña nueva debe ser texto')
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
    )
    .custom((newPassword, { req }) => {
      if (newPassword === req.body.currentPassword) {
        throw new Error(
          'La contraseña nueva debe ser diferente de la actual'
        );
      }

      return true;
    })
];