import { useState } from 'react';
import EstructuraAutenticacion from '../components/AuthLayout.jsx';
import CampoFormulario from '../components/FormField.jsx';
import { registrarUsuario } from '../services/auth.js';
import { guardarSesion } from '../services/sesion.js';
import { nombresRoles, rolesJugador } from '../utils/roles.js';

export default function PaginaRegistro({
  alVolverAlInicioSesion,
  alAutenticar,
}) {
  const [enviando, establecerEnviando] = useState(false);
  const [error, establecerError] = useState('');

  async function enviarFormulario(evento) {
    evento.preventDefault();

    if (enviando) return;

    const campos = new FormData(evento.currentTarget);
    establecerError('');

    if (campos.get('contrasena') !== campos.get('confirmacion')) {
      establecerError('Las contraseñas no coinciden.');
      return;
    }

    establecerEnviando(true);

    try {
      const respuesta = await registrarUsuario({
        nombre: campos.get('nombre'),
        usuario: campos.get('usuario'),
        contrasena: campos.get('contrasena'),
        rol: campos.get('rol'),
      });

      guardarSesion(respuesta.token);
      alAutenticar(respuesta.user);
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerEnviando(false);
    }
  }

  return (
    <EstructuraAutenticacion
      encabezado="Empieza a aprender"
      titulo="Crear cuenta"
      descripcion="Selecciona tu rol para recibir escenarios acordes a ti."
    >
      <form
        className="auth-form register-form"
        onSubmit={enviarFormulario}
      >
        <CampoFormulario id="nombre" etiqueta="Nombre completo">
          <input
            id="nombre"
            name="nombre"
            autoComplete="name"
            minLength={2}
            maxLength={50}
            required
          />
        </CampoFormulario>

        <CampoFormulario
          id="usuario"
          etiqueta="Nombre de usuario"
        >
          <input
            id="usuario"
            name="usuario"
            autoComplete="username"
            minLength={4}
            maxLength={20}
            required
          />
        </CampoFormulario>

        <CampoFormulario id="rol" etiqueta="Rol">
          <select id="rol" name="rol" defaultValue="" required>
            <option value="" disabled>Selecciona tu rol</option>
            {rolesJugador.map((rol) => (
              <option key={rol} value={rol}>
                {nombresRoles[rol]}
              </option>
            ))}
          </select>
        </CampoFormulario>

        <CampoFormulario id="contrasena" etiqueta="Contraseña">
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={64}
            required
          />
        </CampoFormulario>

        <p className="field-hint">
          De 8 a 64 caracteres, con mayúscula, minúscula y número.
        </p>

        <CampoFormulario
          id="confirmacion"
          etiqueta="Confirmar contraseña"
        >
          <input
            id="confirmacion"
            name="confirmacion"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={64}
            required
          />
        </CampoFormulario>

        <button className="primary-button" disabled={enviando}>
          {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        {error && (
          <p className="form-feedback error" role="alert">{error}</p>
        )}
      </form>

      <p className="switch-copy">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          className="text-button"
          onClick={alVolverAlInicioSesion}
        >
          Iniciar sesión
        </button>
      </p>
    </EstructuraAutenticacion>
  );
}