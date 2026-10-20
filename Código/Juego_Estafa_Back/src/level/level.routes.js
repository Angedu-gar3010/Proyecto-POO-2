import { Router } from 'express';
import { USER_ROLES } from '../user/user.constants.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { autorizarRoles } from '../../middlewares/validate.roles.js';
import { validarCampos } from '../../middlewares/validate.fields.js';
import {
  validacionesIdNivel,
  validacionesCrearNivel,
  validacionesActualizarNivel
} from '../../middlewares/validators/level.validators.js';
import {
  obtenerNiveles,
  obtenerNivelPorId,
  crearNivel,
  actualizarNivel,
  desactivarNivel
} from './level.controller.js';

const router = Router();

router.get(
  '/',
  validarJwt,
  obtenerNiveles
);

router.get(
  '/:id',
  validarJwt,
  validacionesIdNivel,
  validarCampos,
  obtenerNivelPorId
);

router.post(
  '/',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesCrearNivel,
  validarCampos,
  crearNivel
);

router.patch(
  '/:id',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesActualizarNivel,
  validarCampos,
  actualizarNivel
);

router.delete(
  '/:id',
  validarJwt,
  autorizarRoles(USER_ROLES.ADMIN),
  validacionesIdNivel,
  validarCampos,
  desactivarNivel
);

export default router;