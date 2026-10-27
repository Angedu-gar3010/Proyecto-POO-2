const CLAVE = 'antiestafas.session';

export function obtenerToken() {
  try {
    const texto =
      sessionStorage.getItem(CLAVE) ||
      localStorage.getItem(CLAVE);

    return texto ? JSON.parse(texto).token || null : null;
  } catch {
    return null;
  }
}

export function guardarSesion(token, recordar = false) {
  try {
    const destino = recordar ? localStorage : sessionStorage;
    const alternativo = recordar ? sessionStorage : localStorage;

    destino.setItem(CLAVE, JSON.stringify({ token }));
    alternativo.removeItem(CLAVE);
  } catch {
    throw new Error(
      'Habilita el almacenamiento del navegador para iniciar sesión.',
    );
  }
}

export function eliminarSesion() {
  for (const nombre of ['localStorage', 'sessionStorage']) {
    try {
      window[nombre].removeItem(CLAVE);
    } catch {
      // El navegador puede bloquear el almacenamiento.
    }
  }
}