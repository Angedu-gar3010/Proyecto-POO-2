import { useEffect, useRef, useState } from 'react';
import ConsultaAdministrativa from '../../components/admin/ConsultaAdministrativa.jsx';
import FormularioEscenario from '../../components/admin/FormmularioEscenario.jsx';
import { guardarEscenario } from '../../services/administracion.js';

export default function PaginaAdminEscenarios({
  nivelId,
  alVolver,
  alCambiar,
}) {
  const [revision, establecerRevision] = useState(0);
  const [edicion, establecerEdicion] = useState(null);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');
  const [mensaje, establecerMensaje] = useState('');

  const referenciaVentana = useRef(null);
  const ventanaAbierta = edicion !== null;

  useEffect(() => {
    if (!ventanaAbierta) return;

    const ventana = referenciaVentana.current;
    const elementoAnterior = document.activeElement;
    const desbordamientoAnterior = document.body.style.overflow;

    ventana.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      ventana.close();
      document.body.style.overflow = desbordamientoAnterior;

      if (
        elementoAnterior instanceof HTMLElement &&
        elementoAnterior.isConnected
      ) {
        elementoAnterior.focus();
      }
    };
  }, [ventanaAbierta]);

  function abrirFormulario(nivel, escenario = {}) {
    establecerError('');
    establecerMensaje('');

    // Conservamos el nivel asociado al formulario abierto.
    establecerEdicion({ nivel, escenario });
  }

  function cerrarFormulario() {
    // Evita cerrar mientras el formulario está guardando.
    const guardando = referenciaVentana.current?.querySelector(
      'fieldset[disabled]',
    );

    if (guardando) return;

    establecerEdicion(null);
  }

  function actualizarListado() {
    establecerEdicion(null);
    establecerRevision((actual) => actual + 1);
    establecerError('');
    establecerMensaje('Escenario guardado correctamente.');
    alCambiar();
  }

  async function cambiarEstado(escenario) {
    if (pendiente) return;

    establecerPendiente(true);
    establecerError('');
    establecerMensaje('');

    try {
      await guardarEscenario(
        { active: !escenario.active },
        escenario._id,
      );

      establecerRevision((actual) => actual + 1);

      establecerMensaje(
        escenario.active
          ? 'Escenario desactivado correctamente.'
          : 'Escenario activado correctamente.',
      );

      alCambiar();
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerPendiente(false);
    }
  }

  return (
    <section className="seccion-escenarios-admin">
      <button
        type="button"
        className="enlace-juego"
        disabled={pendiente}
        onClick={alVolver}
      >
        Volver a los niveles
      </button>

      {mensaje && <p role="status">{mensaje}</p>}

      {error && (
        <p role="alert" className="error-juego">
          {error}
        </p>
      )}

      <ConsultaAdministrativa
        key={`${nivelId}-${revision}`}
        ruta={`/admin/niveles/${nivelId}/escenarios`}
      >
        {({ nivel, escenarios }) => (
          <>
            <div className="barra-admin">
              <h2>{nivel.name}</h2>

              <button
                type="button"
                className="boton-juego"
                disabled={pendiente}
                onClick={() => abrirFormulario(nivel)}
              >
                Crear escenario
              </button>
            </div>

            <div
              className="tabla-admin"
              role="region"
              aria-label="Listado de escenarios"
              tabIndex={0}
            >
              <table>
                <caption>Escenarios del nivel</caption>

                <thead>
                  <tr>
                    <th scope="col">Orden</th>
                    <th scope="col">Título</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Puntos</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {escenarios.map((escenario) => (
                    <tr key={escenario._id}>
                      <td>{escenario.order}</td>
                      <td>{escenario.title}</td>
                      <td>{escenario.type}</td>
                      <td>{escenario.points}</td>

                      <td>
                        {escenario.active ? 'Activo' : 'Inactivo'}
                      </td>

                      <td>
                        <div className="acciones-admin">
                          <button
                            type="button"
                            className="enlace-juego"
                            disabled={pendiente}
                            onClick={() =>
                              abrirFormulario(nivel, escenario)
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="enlace-juego"
                            disabled={pendiente}
                            onClick={() => cambiarEstado(escenario)}
                          >
                            {escenario.active
                              ? 'Desactivar'
                              : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {escenarios.length === 0 && (
                    <tr>
                      <td colSpan={6}>
                        Agrega el primer escenario para poder jugar
                        este nivel.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </ConsultaAdministrativa>

      <dialog
        ref={referenciaVentana}
        className="ventana-nivel-admin"
        aria-label={
          edicion?.escenario._id
            ? 'Editar escenario'
            : 'Crear escenario'
        }
        onCancel={(evento) => {
          evento.preventDefault();
          cerrarFormulario();
        }}
      >
        <button
          type="button"
          className="cerrar-ventana-admin"
          aria-label="Cerrar formulario"
          onClick={cerrarFormulario}
        >
          ×
        </button>

        {edicion !== null && (
          <FormularioEscenario
            key={edicion.escenario._id || 'nuevo'}
            nivel={edicion.nivel}
            escenario={edicion.escenario}
            alGuardar={actualizarListado}
            alCancelar={cerrarFormulario}
          />
        )}
      </dialog>
    </section>
  );
}