import { useEffect, useState } from 'react';
import { solicitarApi } from '../../services/api.js';

export default function ConsultaAdministrativa({
  ruta,
  children,
}) {
  const [datos, establecerDatos] = useState(null);
  const [error, establecerError] = useState('');
  const [intento, establecerIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    solicitarApi(ruta, {
      senal: controlador.signal,
    }).then((respuesta) => {
      if (!controlador.signal.aborted) {
        establecerDatos(respuesta);
      }
    }).catch((fallo) => {
      if (!controlador.signal.aborted) {
        establecerError(fallo.message);
      }
    });

    return () => controlador.abort();
  }, [ruta, intento]);

  if (error) {
    return (
      <div role="alert">
        <p className="error-juego">{error}</p>
        <button
          type="button"
          className="boton-juego"
          onClick={() => {
            establecerDatos(null);
            establecerError('');
            establecerIntento((actual) => actual + 1);
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!datos) {
    return <p role="status">Cargando información…</p>;
  }

  return children(datos);
}