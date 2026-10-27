import Usuario from '../user/user.model.js';
import { ROLES } from '../user/user.constants.js';
import {
  protegerContrasena,
  verificarContrasena,
} from '../../utils/encrypt.js';
import { generarJwt } from '../../utils/jwt.js';
import { crearError } from '../../utils/error.http.js';

function responderSesion(respuesta, usuario, estado = 200) {
  const token = generarJwt({
    uid: usuario.id,
    version: usuario.tokenVersion ?? 0,
  });

  return respuesta.status(estado).json({
    success: true,
    token,
    user: usuario.toJSON(),
  });
}

export async function registrarUsuario(peticion, respuesta) {
  const { name, username, password, role } = peticion.body;

  const usuario = await Usuario.create({
    name,
    username,
    role,
    password: await protegerContrasena(password),
  });

  return responderSesion(respuesta, usuario, 201);
}

export async function iniciarSesion(peticion, respuesta) {
  const { username, password } = peticion.body;

  const usuario = await Usuario.findOne({ username })
    .select('+password +tokenVersion');

  if (
    !usuario ||
    !await verificarContrasena(usuario.password, password)
  ) {
    throw crearError(401, 'Usuario o contraseña incorrectos');
  }

  if (!usuario.status) {
    throw crearError(403, 'La cuenta está desactivada');
  }

  if (!Object.values(ROLES).includes(usuario.role)) {
    throw crearError(409, 'Esta cuenta necesita la migración de roles.');
  }

  return responderSesion(respuesta, usuario);
}