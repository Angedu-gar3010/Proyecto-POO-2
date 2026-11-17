import { useState } from 'react';
import CampoAdministracion from './CampoAdministracion.jsx';
import { nombresRoles, rolesJugador } from '../../utils/roles.js';
import { guardarNivel } from '../../services/administracion.js';

export default function FormularioNivel({
  nivel,
  alGuardar,
  alCancelar,
}) {
  const [enviando, establecerEnviando] = useState(false);
  const [error, establecerError] = useState('');

  async function enviarFormulario(evento) {
    evento.preventDefault();

    if (enviando) return;

    const campos = new FormData(evento.currentTarget);
    const roles = campos.getAll('roles');

    establecerError('');

    if (!roles.length) {
      establecerError('Selecciona al menos un rol.');
      return;
    }

    establecerEnviando(true);

    try {
      await guardarNivel({
        number: Number(campos.get('numero')),
        name: campos.get('nombre').trim(),
        description: campos.get('descripcion').trim(),
        requiredScore: Number(campos.get('puntaje')),
        roles,
        active: campos.has('activo'),
      }, nivel?._id);

      alGuardar();
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerEnviando(false);
    }
  }

  return (
    <form className="formulario-admin" onSubmit={enviarFormulario}>
      <h2>{nivel?._id ? 'Editar nivel' : 'Crear nivel'}</h2>

      <fieldset disabled={enviando}>
        <div className="columnas-admin">
          <CampoAdministracion
            etiqueta="Número global (único)"
            name="numero"
            type="number"
            min="1"
            step="1"
            defaultValue={nivel?.number ?? ''}
            required
          />

          <CampoAdministracion
            etiqueta="Puntaje mínimo para acceder"
            name="puntaje"
            type="number"
            min="0"
            step="1"
            defaultValue={nivel?.requiredScore ?? 0}
            required
          />
        </div>

        <CampoAdministracion
          etiqueta="Nombre"
          name="nombre"
          minLength={2}
          maxLength={80}
          defaultValue={nivel?.name || ''}
          required
        />

        <CampoAdministracion
          etiqueta="Descripción"
          name="descripcion"
          multilinea
          minLength={10}
          maxLength={500}
          defaultValue={nivel?.description || ''}
          required
        />

        <fieldset className="roles-admin">
          <legend>Roles que pueden jugar este nivel</legend>

          {rolesJugador.map((rol) => (
            <label key={rol}>
              <input
                type="checkbox"
                name="roles"
                value={rol}
                defaultChecked={nivel?.roles?.includes(rol) || false}
              />
              {nombresRoles[rol]}
            </label>
          ))}
        </fieldset>

        <label className="casilla-admin">
          <input
            type="checkbox"
            name="activo"
            defaultChecked={nivel?.active ?? false}
          />
          Nivel activo
        </label>

        <p className="detalle-nivel">
          Guarda el nivel y agrega sus escenarios. Con cero escenarios
          todavía no se podrá jugar. Un puntaje mínimo alto puede impedir
          avanzar a usuarios que ya agotaron sus respuestas.
        </p>

        {nivel?.codigoSemilla && (
          <p className="detalle-nivel">
            Identificador del catálogo: {nivel.codigoSemilla} (automático).
          </p>
        )}

        <div className="acciones-admin">
          <button className="boton-juego" disabled={enviando}>
            {enviando ? 'Guardando…' : 'Guardar nivel'}
          </button>

          <button
            type="button"
            className="enlace-juego"
            onClick={alCancelar}
          >
            Cancelar
          </button>
        </div>
      </fieldset>

      {error && (
        <p className="error-juego" role="alert">{error}</p>
      )}
    </form>
  );
}