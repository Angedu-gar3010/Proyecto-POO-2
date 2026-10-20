import { Router } from 'express';
import { USER_ROLES } from '../user/user.constants.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { autorizarRoles } from '../../middlewares/validate.roles.js';
import { validarCampos } from '../../middlewares/validate.fields.js';
import {
  validacionesIdEscenario,
  validacionesParametroIdNivel,
  validacionesCrearEscenario,
  validacionesActualizarEscenario
} from '../../middlewares/validators/scenario.validators.js';
import {
  obtenerEscenariosPorNivel,
  obtenerEscenarioPorId,
  obtenerEscenariosParaAdministrador,
  crearEscenario,
  actualizarEscenario,
  desactivarEscenario
} from './scenario.controller.js';

const router = Router();

router.get(
  '/level/:levelId',
  validarJwt,
  validacionesParametroIdNivel,
  validarCampos,
  obtenerEscenariosPorNivel
);

router.get(
  '/admin',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  obtenerEscenariosParaAdministrador
);

router.get(
  '/:id',
  validarJwt,
  validacionesIdEscenario,
  validarCampos,
  obtenerEscenarioPorId
);

router.post(
  '/',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesCrearEscenario,
  validarCampos,
  crearEscenario
);

router.patch(
  '/:id',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesActualizarEscenario,
  validarCampos,
  actualizarEscenario
);

router.delete(
  '/:id',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesIdEscenario,
  validarCampos,
  desactivarEscenario
);

export default router;