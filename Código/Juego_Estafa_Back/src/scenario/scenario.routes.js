import { Router } from 'express';
import { ROLES } from '../user/user.constants.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { autorizarRoles } from '../../middlewares/validate.roles.js';
import { validarCampos } from '../../middlewares/validate.fields.js';

import {
  validacionesIdEscenario,
  validacionesCrearEscenario,
  validacionesActualizarEscenario,
} from '../../middlewares/validators/scenario.validators.js';

import {
  obtenerEscenariosParaAdministrador,
  obtenerEscenarioPorId,
  crearEscenario,
  actualizarEscenario,
  desactivarEscenario,
} from './scenario.controller.js';

const rutas = Router();

rutas.use(validarJwt, autorizarRoles(ROLES.ADMIN));

rutas.get('/admin', obtenerEscenariosParaAdministrador);

rutas.get(
  '/:id',
  validacionesIdEscenario,
  validarCampos,
  obtenerEscenarioPorId,
);

rutas.post(
  '/',
  validacionesCrearEscenario,
  validarCampos,
  crearEscenario,
);

rutas.patch(
  '/:id',
  validacionesActualizarEscenario,
  validarCampos,
  actualizarEscenario,
);

rutas.delete(
  '/:id',
  validacionesIdEscenario,
  validarCampos,
  desactivarEscenario,
);

export default rutas;