import { Router } from 'express';
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
  actualizarContrasena
} from './user.controller.js';
import { validarJwt } from '../../middlewares/validate.jwt.js';
import { validarCampos } from '../../middlewares/validate.fields.js';
import {
  validacionesActualizarUsuario,
  validacionesActualizarContrasena
} from '../../middlewares/validators/user.validators.js';

const router = Router();

router.get(
  '/me',
  validarJwt,
  obtenerMiPerfil
);

router.patch(
  '/me',
  validarJwt,
  validacionesActualizarUsuario,
  validarCampos,
  actualizarMiPerfil
);

router.patch(
  '/me/password',
  validarJwt,
  validacionesActualizarContrasena,
  validarCampos,
  actualizarContrasena
);

export default router;