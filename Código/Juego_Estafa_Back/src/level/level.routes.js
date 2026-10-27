import { Router } from 'express';
import { body } from 'express-validator';

import { ROLES, ROLES_JUGADOR } from '../user/user.constants.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { autorizarRoles } from '../../middlewares/validate.roles.js';
import { validarCampos } from '../../middlewares/validate.fields.js';
import { permitirCampos } from '../../middlewares/validators/auth.validators.js';

import {
  validacionesIdNivel,
  validacionesCrearNivel,
  validacionesActualizarNivel,
} from '../../middlewares/validators/level.validators.js';

import {
  obtenerNiveles,
  obtenerNivelPorId,
  crearNivel,
  actualizarNivel,
  desactivarNivel,
} from './level.controller.js';

import {
  iniciarNivel,
  responderEscenario,
} from '../progreso/progreso.controller.js';

const rutas = Router();

rutas.use(validarJwt);

rutas.get('/', obtenerNiveles);

rutas.get(
  '/:id',
  validacionesIdNivel,
  validarCampos,
  obtenerNivelPorId,
);

rutas.post(
  '/:id/start',
  autorizarRoles(...ROLES_JUGADOR),
  validacionesIdNivel,
  validarCampos,
  iniciarNivel,
);

rutas.post(
  '/:id/answer',
  autorizarRoles(...ROLES_JUGADOR),
  validacionesIdNivel,
  permitirCampos(['escenarioId', 'esFraude', 'senales']),
  body('escenarioId').isMongoId(),
  body('esFraude').custom((valor) => typeof valor === 'boolean'),
  body('senales')
    .isArray({ max: 50 })
    .bail()
    .custom((valores) => new Set(valores).size === valores.length),
  body('senales.*').isMongoId(),
  validarCampos,
  responderEscenario,
);

rutas.post(
  '/',
  autorizarRoles(ROLES.ADMIN),
  validacionesCrearNivel,
  validarCampos,
  crearNivel,
);

rutas.patch(
  '/:id',
  autorizarRoles(ROLES.ADMIN),
  validacionesActualizarNivel,
  validarCampos,
  actualizarNivel,
);

rutas.delete(
  '/:id',
  autorizarRoles(ROLES.ADMIN),
  validacionesIdNivel,
  validarCampos,
  desactivarNivel,
);

export default rutas;