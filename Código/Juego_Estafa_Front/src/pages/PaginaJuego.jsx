import { useEffect, useState } from 'react';
import { solicitarApi } from '../services/api.js';

export default function PaginaJuego({ nivel, alVolver }) {
  const [avance, establecerAvance] = useState(null);
  const [clasificacion, establecerClasificacion] = useState('');
  const [senales, establecerSenales] = useState([]);
  const [resultado, establecerResultado] = useState(null);
  const [error, establecerError] = useState('');
  const [enviando, establecerEnviando] = useState(false);
  const [intento, establecerIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    solicitarApi(`/levels/${nivel.id}/start`, {
      metodo: 'POST',
      senal: controlador.signal,
    }).then((datos) => {
      if (!controlador.signal.aborted) {
        establecerAvance(datos.avance);
      }
    }).catch((fallo) => {
      if (!controlador.signal.aborted) {
        establecerError(fallo.message);
      }
    });

    return () => controlador.abort();
  }, [nivel.id, intento]);

  async function confirmarRespuesta(evento) {
    evento.preventDefault();

    if (enviando || resultado || !clasificacion) return;

    establecerEnviando(true);
    establecerError('');

    try {
      const datos = await solicitarApi(
        `/levels/${nivel.id}/answer`,
        {
          metodo: 'POST',
          datos: {
            escenarioId: avance.escenario.id,
            esFraude: clasificacion === 'fraude',
            senales,
          },
        },
      );

      establecerResultado(datos.resultado);
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerEnviando(false);
    }
  }

  function continuar() {
    establecerAvance(null);
    establecerResultado(null);
    establecerClasificacion('');
    establecerSenales([]);
    establecerError('');
    establecerIntento((actual) => actual + 1);
  }

  return (
    <>
      <header className="cabecera-juego">
        <h1>{nivel.nombre}</h1>

        <button className="enlace-juego" onClick={alVolver}>
          Volver a niveles
        </button>
      </header>

      {error && (
        <p className="error-juego" role="alert">{error}</p>
      )}

      {!avance ? (
        error ? (
          <button className="boton-juego" onClick={continuar}>
            Reintentar
          </button>
        ) : (
          <p role="status">Cargando escenario…</p>
        )
      ) : avance.completado ? (
        <section className="resultado-final">
          <h2>Nivel completado</h2>

          <p>
            {avance.correctas} de {avance.total} respuestas correctas
          </p>

          <p>
            <strong>
              {avance.puntos} puntos · {avance.estrellas} de 3 estrellas
            </strong>
          </p>

          <button className="boton-juego" onClick={alVolver}>
            Volver a niveles
          </button>
        </section>
      ) : (
        <>
          <p>
            Pregunta {avance.respondidas + 1} de {avance.total}
            {' · '}{avance.puntos} puntos guardados
          </p>

          <div className="columnas-escenario">
            <article className="mensaje-escenario">
              <p className="remitente">
                {avance.escenario.contenido.sender}
              </p>

              <h2>{avance.escenario.titulo}</h2>

              {avance.escenario.contenido.subject && (
                <h3>{avance.escenario.contenido.subject}</h3>
              )}

              <p className="texto-escenario">
                {avance.escenario.contenido.message}
              </p>

              {avance.escenario.contenido.url && (
                <p className="direccion-ejemplo">
                  {avance.escenario.contenido.url}
                </p>
              )}
            </article>

            <form
              className="formulario-juego"
              onSubmit={confirmarRespuesta}
            >
              <fieldset disabled={enviando || Boolean(resultado)}>
                <legend>
                  ¿Este mensaje es seguro o fraudulento?
                </legend>

                <div className="opciones-clasificacion">
                  <label>
                    <input
                      type="radio"
                      name="clasificacion"
                      value="seguro"
                      checked={clasificacion === 'seguro'}
                      onChange={() => establecerClasificacion('seguro')}
                      required
                    />
                    Seguro
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="clasificacion"
                      value="fraude"
                      checked={clasificacion === 'fraude'}
                      onChange={() => establecerClasificacion('fraude')}
                      required
                    />
                    Fraudulento
                  </label>
                </div>

                <h3>Selecciona las señales de alerta</h3>

                {avance.escenario.senales.map((senal) => (
                  <label className="opcion-senal" key={senal.id}>
                    <input
                      type="checkbox"
                      checked={senales.includes(senal.id)}
                      onChange={(evento) => {
                        establecerSenales((actuales) => (
                          evento.target.checked
                            ? [...actuales, senal.id]
                            : actuales.filter((id) => id !== senal.id)
                        ));
                      }}
                    />
                    {senal.texto}
                  </label>
                ))}
              </fieldset>

              {!resultado && (
                <button
                  className="boton-juego"
                  disabled={enviando || !clasificacion}
                >
                  {enviando ? 'Guardando…' : 'Confirmar respuesta'}
                </button>
              )}
            </form>
          </div>

          {resultado && (
            <section className="retroalimentacion" role="status">
              <h2>
                {resultado.correcta
                  ? '¡Respuesta correcta!'
                  : 'Revisa estas señales'}
                {' · '}{resultado.puntos} puntos
              </h2>

              <p>{resultado.explicacion}</p>
              <p>{resultado.recomendacion}</p>

              <p>
                <strong>Clasificación:</strong>{' '}
                {resultado.esFraude ? 'Fraudulento' : 'Seguro'}
              </p>

              <p>
                <strong>Señales correctas:</strong>{' '}
                {resultado.senalesCorrectas.join('; ') ||
                  'Ninguna de las opciones.'}
              </p>

              <button className="boton-juego" onClick={continuar}>
                {avance.respondidas + 1 === avance.total
                  ? 'Ver resultado'
                  : 'Siguiente escenario'}
              </button>
            </section>
          )}
        </>
      )}
    </>
  );
}