import { useState } from 'react';
import EstructuraAutenticacion from '../components/AuthLayout.jsx';
import CampoFormulario from '../components/FormField.jsx';
import { iniciarSesion } from '../services/auth.js';
import { guardarSesion } from '../services/sesion.js';

export default function PaginaInicioSesion({
  alCrearCuenta,
  alAutenticar,
  aviso,
}) {
  const [enviando, establecerEnviando] = useState(false);
  const [error, establecerError] = useState('');

  async function enviarFormulario(evento) {
    evento.preventDefault();

    if (enviando) return;

    const campos = new FormData(evento.currentTarget);

    establecerEnviando(true);
    establecerError('');

    try {
      const respuesta = await iniciarSesion({
        usuario: campos.get('usuario'),
        contrasena: campos.get('contrasena'),
      });

      guardarSesion(respuesta.token, campos.has('recordar'));
      alAutenticar(respuesta.user);
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerEnviando(false);
    }
  }

  return (
    <EstructuraAutenticacion
      encabezado="Bienvenido de nuevo"
      titulo="Iniciar sesión"
      descripcion="Continúa aprendiendo a protegerte en internet."
    >
      <form className="auth-form" onSubmit={enviarFormulario}>
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

        <CampoFormulario id="contrasena" etiqueta="Contraseña">
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            autoComplete="current-password"
            required
          />
        </CampoFormulario>

        <label className="remember-option">
          <input name="recordar" type="checkbox" />
          Recordar mi sesión
        </label>

        <button className="primary-button" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        {aviso && (
          <p className="form-feedback" role="status">{aviso}</p>
        )}

        {error && (
          <p className="form-feedback error" role="alert">{error}</p>
        )}
      </form>

      <p className="switch-copy">
        ¿Aún no tienes cuenta?{' '}
        <button
          type="button"
          className="text-button"
          onClick={alCrearCuenta}
        >
          Crear cuenta
        </button>
      </p>
    </EstructuraAutenticacion>
  );
}