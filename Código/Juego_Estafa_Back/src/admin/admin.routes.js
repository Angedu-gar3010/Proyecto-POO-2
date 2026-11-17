import { Router } from 'express';
import { body, param, query } from 'express-validator';

import { ROLES } from '../user/user.constants.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { autorizarRoles } from '../../middlewares/validate.roles.js';
import { validarCampos } from '../../middlewares/validate.fields.js';
import { permitirCampos } from '../../middlewares/validators/auth.validators.js';

import {
  obtenerResumenAdministrativo,
  listarNivelesAdministrativos,
  listarEscenariosAdministrativos,
  listarUsuarios,
  cambiarEstadoUsuario,
  consultarProgresoUsuario,
} from './admin.controller.js';

const rutas = Router();

const validarId = [
  param('id').isMongoId().withMessage('Identificador inválido'),
  validarCampos,
];

rutas.use(validarJwt, autorizarRoles(ROLES.ADMIN));

rutas.get('/resumen', obtenerResumenAdministrativo);

rutas.get('/niveles', listarNivelesAdministrativos);

rutas.get(
  '/niveles/:id/escenarios',
  validarId,
  listarEscenariosAdministrativos,
);

rutas.get(
  '/usuarios',
  query('pagina')
    .optional()
    .isInt({ min: 1, max: 100000 })
    .toInt(),
  query('buscar')
    .optional()
    .isString()
    .bail()
    .trim()
    .isLength({ max: 80 }),
  query('rol')
    .optional()
    .isIn(['', ...Object.values(ROLES)]),
  validarCampos,
  listarUsuarios,
);

rutas.patch(
  '/usuarios/:id/estado',
  validarId,
  permitirCampos(['activo']),
  body('activo').custom((valor) => typeof valor === 'boolean'),
  validarCampos,
  cambiarEstadoUsuario,
);

rutas.get(
  '/usuarios/:id/progreso',
  validarId,
  consultarProgresoUsuario,
);

export default rutas;