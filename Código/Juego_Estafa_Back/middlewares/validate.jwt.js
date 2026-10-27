import jwt from 'jsonwebtoken';
import Usuario from '../src/user/user.model.js';
import { ROLES } from '../src/user/user.constants.js';
import { crearError } from '../utils/error.http.js';

export async function validarJwt(peticion, _respuesta, siguiente) {
  const cabecera = peticion.headers.authorization;

  if (!cabecera?.startsWith('Bearer ')) {
    throw crearError(401, 'Debes iniciar sesión.');
  }

  let contenido;

  try {
    contenido = jwt.verify(
      cabecera.slice(7),
      process.env.SECRET_KEY,
      { algorithms: ['HS256'] },
    );
  } catch {
    throw crearError(401, 'La sesión es inválida o ha expirado.');
  }

  if (!/^[a-f0-9]{24}$/i.test(contenido.uid || '')) {
    throw crearError(401, 'La sesión no es válida.');
  }

  const usuario = await Usuario.findById(contenido.uid)
    .select('+tokenVersion');

  if (
    !usuario?.status ||
    (contenido.version ?? 0) !== usuario.tokenVersion
  ) {
    throw crearError(401, 'Debes iniciar sesión nuevamente.');
  }

  if (!Object.values(ROLES).includes(usuario.role)) {
    throw crearError(403, 'Esta cuenta necesita la migración de roles.');
  }

  peticion.user = {
    id: usuario.id,
    role: usuario.role,
  };

  siguiente();
}