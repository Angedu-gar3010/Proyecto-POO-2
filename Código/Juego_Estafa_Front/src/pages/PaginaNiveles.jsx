import { useEffect, useState } from 'react';
import { solicitarApi } from '../services/api.js';

import IconoNivel from '../components/IconoNivel.jsx';
import TarjetaNivel from '../components/TarjetaNivel.jsx';
import ProgresoGeneral from '../components/ProgresoGeneral.jsx';
import { nombresRoles } from '../utils/roles.js';

const estiloPagina = {
  display: 'flow-root',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
};

const estiloCajaNiveles = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  maxHeight: 'min(560px, 60dvh)',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px',
  margin: '20px 0',
  border: '1px solid #dce6fa',
  borderRadius: '18px',
  background: '#f6f9ff',
  boxSizing: 'border-box',
  scrollbarGutter: 'stable',
  scrollbarWidth: 'thin',
  scrollbarColor: '#a7b8e8 #f3f6ff',
};

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
    })
      .then((respuesta) => {
        if (!controlador.signal.aborted) {
          establecerDatos(respuesta);
        }
      })
      .catch((fallo) => {
        if (!controlador.signal.aborted) {
          establecerError(fallo.message);
        }
      });

    return () => controlador.abort();
  }, [intento]);

  function reintentarCarga() {
    establecerError('');
    establecerIntento((actual) => actual + 1);
  }

  return (
    <div style={estiloPagina}>
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

          <p>
            Aprende a reconocer diferentes tipos de estafas
          </p>
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
            type="button"
            className="boton-juego"
            onClick={reintentarCarga}
          >
            Reintentar
          </button>
        </div>
      ) : !datos ? (
        <p role="status">Cargando niveles…</p>
      ) : (
        <>
          <section
            style={estiloCajaNiveles}
            aria-label="Listado de niveles disponibles"
            tabIndex={0}
          >
            {datos.niveles.length > 0 ? (
              <div className="rejilla-niveles">
                {datos.niveles.map((nivel) => (
                  <TarjetaNivel
                    key={nivel.id}
                    nivel={nivel}
                    administrador={administrador}
                    alSeleccionar={alSeleccionar}
                  />
                ))}
              </div>
            ) : (
              <p>
                {administrador
                  ? 'Todavía no hay niveles disponibles.'
                  : 'Todavía no hay niveles asignados a tu rol.'}
              </p>
            )}
          </section>

          {!administrador && (
            <ProgresoGeneral
              completados={
                datos.niveles.filter(
                  (nivel) => nivel.completado,
                ).length
              }
              total={datos.niveles.length}
            />
          )}
        </>
      )}
    </div>
  );
}