import { body } from 'express-validator';
import {
  permitirCampos,
  validarNombre,
  validarUsuario,
  validarContrasena,
} from './auth.validators.js';

export const validacionesActualizarUsuario = [
  permitirCampos(['name', 'username']),
  validarNombre().optional(),
  validarUsuario().optional(),
];

export const validacionesActualizarContrasena = [
  permitirCampos(['currentPassword', 'newPassword']),

  body('currentPassword')
    .isString()
    .bail()
    .notEmpty(),

  validarContrasena('newPassword')
    .custom((nueva, { req: peticion }) => {
      if (nueva === peticion.body.currentPassword) {
        throw new Error('La nueva contraseña debe ser diferente');
      }

      return true;
    }),
];