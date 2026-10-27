import Usuario from './user.model.js';
import {
  protegerContrasena,
  verificarContrasena,
} from '../../utils/encrypt.js';
import { crearError } from '../../utils/error.http.js';

export async function obtenerMiPerfil(peticion, respuesta) {
  const usuario = await Usuario.findById(peticion.user.id);

  if (!usuario) throw crearError(404, 'Usuario no encontrado');

  respuesta.json({
    success: true,
    user: usuario,
  });
}

export async function actualizarMiPerfil(peticion, respuesta) {
  const cambios = {};

  for (const campo of ['name', 'username']) {
    if (peticion.body[campo] !== undefined) {
      cambios[campo] = peticion.body[campo];
    }
  }

  const usuario = await Usuario.findByIdAndUpdate(
    peticion.user.id,
    { $set: cambios },
    { new: true, runValidators: true },
  );

  if (!usuario) throw crearError(404, 'Usuario no encontrado');

  respuesta.json({
    success: true,
    user: usuario,
    message: 'Datos actualizados',
  });
}

export async function actualizarContrasena(peticion, respuesta) {
  const usuario = await Usuario.findById(peticion.user.id)
    .select('+password +tokenVersion');

  if (!usuario) throw crearError(404, 'Usuario no encontrado');

  const correcta = await verificarContrasena(
    usuario.password,
    peticion.body.currentPassword,
  );

  if (!correcta) {
    throw crearError(400, 'La contraseña actual es incorrecta');
  }

  const actualizacion = await Usuario.updateOne(
    {
      _id: usuario.id,
      password: usuario.password,
    },
    {
      $set: {
        password: await protegerContrasena(peticion.body.newPassword),
      },
      $inc: { tokenVersion: 1 },
    },
    { runValidators: true },
  );

  if (!actualizacion.modifiedCount) {
    throw crearError(
      409,
      'La contraseña ya cambió. Inicia sesión nuevamente.',
    );
  }

  respuesta.json({
    success: true,
    message: 'Contraseña actualizada. Inicia sesión nuevamente.',
  });
}