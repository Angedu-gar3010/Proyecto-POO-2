import { body } from 'express-validator';
import { ROLES_JUGADOR } from '../../src/user/user.constants.js';

export const validarNombre = () => body('name')
  .isString()
  .bail()
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('El nombre debe tener entre 2 y 50 caracteres');

export const validarUsuario = () => body('username')
  .isString()
  .bail()
  .trim()
  .toLowerCase()
  .matches(/^[a-z0-9._-]{4,20}$/)
  .withMessage(
    'El usuario debe tener de 4 a 20 letras, números, puntos o guiones',
  );

export const validarContrasena = (campo) => body(campo)
  .isString()
  .bail()
  .isLength({ min: 8, max: 64 })
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
  })
  .withMessage(
    'Usa de 8 a 64 caracteres, con mayúscula, minúscula y número',
  );

export const permitirCampos = (permitidos) => body()
  .custom((datos) => {
    if (
      !datos ||
      Array.isArray(datos) ||
      typeof datos !== 'object' ||
      !Object.keys(datos).length ||
      Object.keys(datos).some((campo) => !permitidos.includes(campo))
    ) {
      throw new Error(
        'Envía únicamente los campos permitidos y al menos uno',
      );
    }

    return true;
  });

export const validacionesRegistro = [
  permitirCampos(['name', 'username', 'password', 'role']),
  validarNombre(),
  validarUsuario(),
  validarContrasena('password'),
  body('role')
    .isIn(ROLES_JUGADOR)
    .withMessage('Selecciona un rol de jugador válido'),
];

export const validacionesInicioSesion = [
  validarUsuario(),
  body('password')
    .isString()
    .bail()
    .notEmpty()
    .withMessage('Ingresa tu contraseña'),
];