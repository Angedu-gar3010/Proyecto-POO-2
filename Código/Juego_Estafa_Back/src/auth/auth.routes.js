import { Router } from 'express';
import {
  registrarUsuario,
  iniciarSesion
} from './auth.controller.js';
import {
  validacionesRegistro,
  validacionesInicioSesion
} from '../../middlewares/validators/auth.validators.js';
import { validarCampos } from '../../middlewares/validate.fields.js';

const router = Router();

router.post(
  '/register',
  validacionesRegistro,
  validarCampos,
  registrarUsuario
);

router.post(
  '/login',
  validacionesInicioSesion,
  validarCampos,
  iniciarSesion
);

export default router;