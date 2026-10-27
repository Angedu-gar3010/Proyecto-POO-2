import { solicitarApi } from './api.js';

export function iniciarSesion({ usuario, contrasena }) {
  return solicitarApi('/auth/login', {
    metodo: 'POST',
    publica: true,
    datos: {
      username: usuario.trim(),
      password: contrasena,
    },
  });
}

export function registrarUsuario({
  nombre,
  usuario,
  contrasena,
  rol,
}) {
  return solicitarApi('/auth/register', {
    metodo: 'POST',
    publica: true,
    datos: {
      name: nombre.trim(),
      username: usuario.trim(),
      password: contrasena,
      role: rol,
    },
  });
}