import { solicitarApi } from './api.js';

export function guardarNivel(datos, id) {
  return solicitarApi(
    id ? `/levels/${id}` : '/levels',
    {
      metodo: id ? 'PATCH' : 'POST',
      datos,
    },
  );
}

export function guardarEscenario(datos, id) {
  return solicitarApi(
    id ? `/scenarios/${id}` : '/scenarios',
    {
      metodo: id ? 'PATCH' : 'POST',
      datos,
    },
  );
}

export function cambiarEstadoJugador(id, activo) {
  return solicitarApi(`/admin/usuarios/${id}/estado`, {
    metodo: 'PATCH',
    datos: { activo },
  });
}