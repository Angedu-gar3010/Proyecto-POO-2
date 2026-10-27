import { useEffect, useState } from 'react';
import { solicitarApi } from '../services/api.js';

import IconoNivel from '../components/IconoNivel.jsx';
import TarjetaNivel from '../components/TarjetaNivel.jsx'
import ProgresoGeneral from '../components/ProgresoGeneral.jsx';
import { nombresRoles } from '../utils/roles.js';

export default function PaginaNiveles({
  usuario,
  alSeleccionar,
}) {
  const [datos, establecerDatos] = useState(null);
  const [error, establecerError] = useState('');
  const [intento, establecerIntento] = useState(0);

  const administrador = usuario.role === 'ADMIN';

  useEffect(() => {
    const controlador = new AbortController();

    solicitarApi('/levels', {
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
  }, [intento]);

  return (
    <>
      <header className="cabecera-niveles">
        <div className="marca-juego">
          <IconoNivel />
          <span>Juego AntiEstafas</span>
        </div>

        <div className="titulo-pagina">
          <h1>
            {administrador
              ? 'Niveles del juego'
              : 'Selecciona un nivel'}
          </h1>
          <p>Aprende a reconocer diferentes tipos de estafas</p>
        </div>

        <div className="puntos-juego">
          <IconoNivel tipo="estrella" />
          <strong>
            {datos ? datos.puntosTotales : '—'} puntos
          </strong>
        </div>
      </header>

      <p className="subtitulo-rol">
        {nombresRoles[usuario.role]}
        {administrador && ' · Vista de consulta'}
      </p>

      {error ? (
        <div role="alert">
          <p>{error}</p>
          <button
            className="boton-juego"
            onClick={() => {
              establecerError('');
              establecerIntento((actual) => actual + 1);
            }}
          >
            Reintentar
          </button>
        </div>
      ) : !datos ? (
        <p role="status">Cargando niveles…</p>
      ) : (
        <>
          {datos.niveles.length ? (
            <section
              className="rejilla-niveles"
              aria-label="Niveles disponibles"
            >
              {datos.niveles.map((nivel) => (
                <TarjetaNivel
                  key={nivel.id}
                  nivel={nivel}
                  administrador={administrador}
                  alSeleccionar={alSeleccionar}
                />
              ))}
            </section>
          ) : (
            <p>Todavía no hay niveles asignados a tu rol.</p>
          )}

          {!administrador && (
            <ProgresoGeneral
              completados={
                datos.niveles.filter((nivel) => nivel.completado).length
              }
              total={datos.niveles.length}
            />
          )}
        </>
      )}
    </>
  );
}