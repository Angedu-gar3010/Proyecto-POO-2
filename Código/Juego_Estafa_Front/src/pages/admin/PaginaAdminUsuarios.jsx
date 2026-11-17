import { useState } from 'react';
import ConsultaAdministrativa from '../../components/admin/ConsultaAdministrativa.jsx';
import { cambiarEstadoJugador } from '../../services/administracion.js';
import { nombresRoles } from '../../utils/roles.js';

export default function PaginaAdminUsuarios({ alCambiar }) {
  const [filtros, establecerFiltros] = useState({
    buscar: '',
    rol: '',
    pagina: 1,
  });

  const [revision, establecerRevision] = useState(0);
  const [seleccionado, establecerSeleccionado] = useState(null);
  const [pendiente, establecerPendiente] = useState(false);
  const [error, establecerError] = useState('');

  const consulta = new URLSearchParams(filtros).toString();

  function buscarUsuarios(evento) {
    evento.preventDefault();

    const campos = new FormData(evento.currentTarget);

    establecerFiltros({
      buscar: campos.get('buscar').trim(),
      rol: campos.get('rol'),
      pagina: 1,
    });
  }

  async function cambiarEstado(usuario) {
    if (pendiente) return;

    establecerPendiente(true);
    establecerError('');

    try {
      await cambiarEstadoJugador(usuario._id, !usuario.status);
      establecerRevision((actual) => actual + 1);
      alCambiar();
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerPendiente(false);
    }
  }

  return (
    <>
      <h2>Usuarios y progreso</h2>

      <form className="filtros-admin" onChange={buscarUsuarios}>
        <label className="campo-admin">
          Nombre o usuario
          <input name="buscar" maxLength={80} />
        </label>

        <label className="campo-admin">
          Rol
          <select name="rol">
            <option value="">Todos</option>
            {Object.entries(nombresRoles).map(([rol, nombre]) => (
              <option key={rol} value={rol}>{nombre}</option>
            ))}
          </select>
        </label>

        <button className="boton-juego">Buscar</button>
      </form>

      {error && <p role="alert" className="error-juego">{error}</p>}

      <ConsultaAdministrativa
        key={`${consulta}-${revision}`}
        ruta={`/admin/usuarios?${consulta}`}
      >
        {({ usuarios, pagina, paginas, total }) => (
          <>
            <div className="tabla-admin">
              <table>
                <caption>{total} usuarios encontrados</caption>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario._id}>
                      <td>{usuario.name}</td>
                      <td>{usuario.username}</td>
                      <td>
                        {nombresRoles[usuario.role] || usuario.role}
                      </td>
                      <td>{usuario.status ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <div className="acciones-admin">
                          <button
                            className="enlace-juego"
                            onClick={() => establecerSeleccionado(
                              usuario._id,
                            )}
                          >
                            Ver progreso
                          </button>

                          {usuario.role !== 'ADMIN' && (
                            <button
                              className="enlace-juego"
                              disabled={pendiente}
                              onClick={() => cambiarEstado(usuario)}
                            >
                              {usuario.status ? 'Desactivar' : 'Activar'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!usuarios.length && (
                    <tr>
                      <td colSpan={5}>
                        No hay usuarios que coincidan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="acciones-admin">
              <button
                className="enlace-juego"
                disabled={pagina <= 1}
                onClick={() => establecerFiltros((actual) => ({
                  ...actual,
                  pagina: pagina - 1,
                }))}
              >
                Anterior
              </button>

              <span>Página {pagina} de {paginas}</span>

              <button
                className="enlace-juego"
                disabled={pagina >= paginas}
                onClick={() => establecerFiltros((actual) => ({
                  ...actual,
                  pagina: pagina + 1,
                }))}
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </ConsultaAdministrativa>

      {seleccionado && (
        <section className="progreso-admin">
          <button
            className="enlace-juego"
            onClick={() => establecerSeleccionado(null)}
          >
            Cerrar progreso
          </button>

          <ConsultaAdministrativa
            key={seleccionado}
            ruta={`/admin/usuarios/${seleccionado}/progreso`}
          >
            {({ usuario, progresos }) => (
              <>
                <h3>Progreso de {usuario.name}</h3>

                <div className="tabla-admin">
                  <table>
                    <caption>Avance registrado por nivel</caption>
                    <thead>
                      <tr>
                        <th>Nivel</th>
                        <th>Respuestas</th>
                        <th>Aciertos</th>
                        <th>Puntos</th>
                        <th>Estrellas</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {progresos.map((progreso) => (
                        <tr key={progreso.id}>
                          <td>
                            {progreso.nivel?.name || 'Nivel no disponible'}
                          </td>
                          <td>
                            {progreso.respondidas}/{progreso.total}
                          </td>
                          <td>{progreso.correctas}</td>
                          <td>{progreso.puntos}</td>
                          <td>{progreso.estrellas}/3</td>
                          <td>
                            {progreso.completado
                              ? 'Completado'
                              : 'En progreso'}
                          </td>
                        </tr>
                      ))}

                      {!progresos.length && (
                        <tr>
                          <td colSpan={6}>
                            Todavía no ha iniciado niveles.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </ConsultaAdministrativa>
        </section>
      )}
    </>
  );
}