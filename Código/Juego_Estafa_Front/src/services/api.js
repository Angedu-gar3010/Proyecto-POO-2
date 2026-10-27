import { obtenerToken, eliminarSesion } from './sesion.js';

export async function solicitarApi(ruta, {
  metodo = 'GET',
  datos,
  senal,
  publica = false,
} = {}) {
  const cabeceras = {
    Accept: 'application/json',
  };

  if (datos !== undefined) {
    cabeceras['Content-Type'] = 'application/json';
  }

  if (!publica) {
    cabeceras.Authorization = `Bearer ${obtenerToken() || ''}`;
  }

  let respuesta;

  try {
    respuesta = await fetch(`/api/v1${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: datos === undefined
        ? undefined
        : JSON.stringify(datos),
      signal: senal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    throw new Error(
      'No se pudo conectar con el servidor. Inténtalo nuevamente.',
      { cause: error },
    );
  }

  const contenido = await respuesta.json().catch(() => null);

  if (!publica && respuesta.status === 401) {
    eliminarSesion();
    window.dispatchEvent(new Event('sesion-caducada'));
  }

  if (!respuesta.ok || !contenido?.success) {
    throw new Error(
      contenido?.errors?.[0]?.message ||
      contenido?.message ||
      'No se pudo completar la solicitud.',
    );
  }

  return contenido;
}