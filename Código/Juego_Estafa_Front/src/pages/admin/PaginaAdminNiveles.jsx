import { useEffect, useRef, useState } from 'react';
import ConsultaAdministrativa from '../../components/admin/ConsultaAdministrativa.jsx';
import FormularioNivel from '../../components/admin/FormularioNivel.jsx';
import { guardarNivel } from '../../services/administracion.js';
import { nombresRoles } from '../../utils/roles.js';

export default function PaginaAdminNiveles({
  alVerEscenarios,
  alCambiar,
}) {
  const [edicion, establecerEdicion] = useState(null);
  const [revision, establecerRevision] = useState(0);
  const [filtro, establecerFiltro] = useState('');
  const [pendiente, establecerPendiente] = useState(false);
  const [mensaje, establecerMensaje] = useState('');
  const [error, establecerError] = useState('');

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

      if (elementoAnterior instanceof HTMLElement) {
        elementoAnterior.focus();
      }
    };
  }, [ventanaAbierta]);

  function abrirFormulario(nivel = {}) {
    establecerMensaje('');
    establecerError('');
    establecerEdicion(nivel);
  }

  function cerrarFormulario() {
    // El formulario deshabilita su fieldset mientras guarda.
    const guardando = referenciaVentana.current?.querySelector(
      'fieldset[disabled]',
    );

    if (guardando) return;

    establecerEdicion(null);
  }

  function actualizarListado() {
    establecerEdicion(null);
    establecerRevision((actual) => actual + 1);
    establecerMensaje('Nivel guardado correctamente.');
    establecerError('');
    alCambiar();
  }

  async function cambiarEstado(nivel) {
    if (pendiente) return;

    establecerPendiente(true);
    establecerError('');
    establecerMensaje('');

    try {
      await guardarNivel(
        { active: !nivel.active },
        nivel._id,
      );

      establecerRevision((actual) => actual + 1);
      establecerMensaje(
        nivel.active
          ? 'Nivel desactivado correctamente.'
          : 'Nivel activado correctamente.',
      );

      alCambiar();
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerPendiente(false);
    }
  }

  return (
    <section className="seccion-niveles-admin">
      <div className="barra-admin">
        <h2>Niveles</h2>

        <button
          type="button"
          className="boton-juego"
          disabled={pendiente}
          onClick={() => abrirFormulario()}
        >
          Crear nivel
        </button>
      </div>

      {mensaje && <p role="status">{mensaje}</p>}

      {error && (
        <p role="alert" className="error-juego">
          {error}
        </p>
      )}

      <label className="campo-admin">
        Buscar por nombre

        <input
          type="search"
          value={filtro}
          onChange={(evento) => establecerFiltro(evento.target.value)}
        />
      </label>

      <ConsultaAdministrativa
        key={revision}
        ruta="/admin/niveles"
      >
        {({ niveles }) => {
          const busqueda = filtro.trim().toLowerCase();

          const visibles = niveles.filter((nivel) =>
            nivel.name.toLowerCase().includes(busqueda),
          );

          return (
            <div
              className="tabla-admin tabla-admin-niveles"
              role="region"
              aria-label="Listado de niveles"
              tabIndex={0}
            >
              <table>

                <thead>
                  <tr>
                    <th scope="col">Número</th>
                    <th scope="col">Nivel</th>
                    <th scope="col">Roles</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {visibles.map((nivel) => (
                    <tr key={nivel._id}>
                      <td>{nivel.number}</td>

                      <td>
                        {nivel.name}
                        <small>
                          Mínimo: {nivel.requiredScore} puntos
                        </small>
                      </td>

                      <td>
                        {(nivel.roles || [])
                          .map((rol) => nombresRoles[rol] || rol)
                          .join(', ') || 'Sin asignar'}
                      </td>

                      <td>
                        {nivel.active ? 'Activo' : 'Inactivo'}
                      </td>

                      <td>
                        <div className="acciones-admin">
                          <button
                            type="button"
                            className="enlace-juego"
                            disabled={pendiente}
                            onClick={() => abrirFormulario(nivel)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="enlace-juego"
                            disabled={pendiente}
                            onClick={() => alVerEscenarios(nivel._id)}
                          >
                            Escenarios
                          </button>

                          <button
                            type="button"
                            className="enlace-juego"
                            disabled={pendiente}
                            onClick={() => cambiarEstado(nivel)}
                          >
                            {nivel.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {visibles.length === 0 && (
                    <tr>
                      <td colSpan={5}>
                        No hay niveles que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        }}
      </ConsultaAdministrativa>

      <dialog
        ref={referenciaVentana}
        className="ventana-nivel-admin"
        aria-label={edicion?._id ? 'Editar nivel' : 'Crear nivel'}
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
          <FormularioNivel
            key={edicion._id || 'nuevo'}
            nivel={edicion}
            alGuardar={actualizarListado}
            alCancelar={cerrarFormulario}
          />
        )}
      </dialog>
    </section>
  );
}