import IconoNivel from './IconoNivel.jsx';
import { nombresRoles } from '../utils/roles.js';

export default function TarjetaNivel({
  nivel,
  administrador,
  alSeleccionar,
}) {
  const etiquetas = {
    disponible: 'Disponible',
    bloqueado: 'Bloqueado',
    completado: 'Completado',
    en_progreso: `En progreso · ${nivel.respondidas}/${nivel.total}`,
  };

  const bloqueado =
    nivel.estado === 'bloqueado' ||
    nivel.total === 0;

  return (
    <article className={`tarjeta-nivel tarjeta-nivel--${nivel.estado}`}>
      <div className="contenido-nivel">
        <IconoNivel
          tipo={nivel.roles[0]}
          clase="ilustracion-nivel"
        />

        <div>
          <p className="numero-nivel">Nivel {nivel.numero}</p>
          <h2>{nivel.nombre}</h2>

          <p className={`estado-nivel estado-nivel--${nivel.estado}`}>
            {nivel.estado === 'completado' && (
              <span aria-hidden="true">✓ </span>
            )}
            {nivel.estado === 'bloqueado' && (
              <span aria-hidden="true">🔒 </span>
            )}
            {etiquetas[nivel.estado]}
          </p>

          <div
            className="estrellas-nivel"
            role="img"
            aria-label={`${nivel.estrellas} de 3 estrellas`}
          >
            {[1, 2, 3].map((numero) => (
              <IconoNivel
                key={numero}
                tipo="estrella"
                clase={numero <= nivel.estrellas
                  ? 'estrella-ganada'
                  : 'estrella-pendiente'}
              />
            ))}
          </div>
        </div>
      </div>

      {administrador ? (
        <p className="detalle-nivel">
          {nivel.roles.map((rol) => nombresRoles[rol]).join(' · ')}
          {' · '}{nivel.total} escenarios
        </p>
      ) : (
        <>
          {nivel.estado === 'bloqueado' && (
            <p className="detalle-nivel">
              Necesitas {nivel.puntosRequeridos} puntos
            </p>
          )}

          <button
            className={`boton-juego ${
              nivel.estado === 'en_progreso'
                ? ''
                : 'boton-juego--secundario'
            }`}
            disabled={bloqueado}
            onClick={() => alSeleccionar(nivel)}
          >
            {!nivel.total
              ? 'Sin escenarios'
              : nivel.estado === 'completado'
                ? 'Ver resultado'
                : nivel.estado === 'en_progreso'
                  ? 'Continuar'
                  : nivel.estado === 'bloqueado'
                    ? 'Bloqueado'
                    : 'Jugar'}
          </button>
        </>
      )}
    </article>
  );
}