import { useState } from 'react';
import EstructuraAutenticacion from '../components/AuthLayout.jsx';
import CampoFormulario from '../components/FormField.jsx';
import { iniciarSesion, guardarSesion } from '../services/auth.js';

export default function PaginaInicioSesion({ alCrearCuenta }) {
  const [pending, establecerCargando] = useState(false);
  const [feedback, establecerMensaje] = useState(null);

  async function manejarEnvio(event) {
    event.preventDefault();

    if (pending) return;

    const fields = new FormData(event.currentTarget);

    establecerCargando(true);
    establecerMensaje(null);

    try {
      const data = await iniciarSesion({
        username: fields.get('username'),
        password: fields.get('password'),
      });

      guardarSesion(data, fields.has('remember'));

      establecerMensaje({
        type: 'success',
        message: data.message || 'Sesión iniciada correctamente.',
      });
    } catch (error) {
      establecerMensaje({
        type: 'error',
        message: error.message,
      });
    } finally {
      establecerCargando(false);
    }
  }

  return (
    <EstructuraAutenticacion
      eyebrow="Bienvenido de nuevo"
      title="Iniciar sesión"
      description="Continúa aprendiendo a protegerte en internet."
    >
      <form className="auth-form" onSubmit={manejarEnvio}>
        <CampoFormulario id="username" label="Nombre de usuario">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Ingresa tu usuario"
            minLength={4}
            maxLength={20}
            required
          />
        </CampoFormulario>

        <CampoFormulario id="password" label="Contraseña" icon="lock">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </CampoFormulario>

        <label className="remember-option">
          <input type="checkbox" name="remember" />
          <span>Recordar mi sesión</span>
        </label>

        <button
          className="primary-button"
          type="submit"
          disabled={pending}
        >
          {pending ? 'Ingresando...' : 'Ingresar'}
          {!pending && <span aria-hidden="true">→</span>}
        </button>

        {feedback && (
          <p className={`form-feedback ${feedback.type}`} role="status">
            {feedback.message}
          </p>
        )}
      </form>

      <p className="switch-copy">
        ¿Aún no tienes una cuenta?{' '}
        <button
          className="text-button"
          type="button"
          onClick={alCrearCuenta}
        >
          Crear cuenta
        </button>
      </p>
    </EstructuraAutenticacion>
  );
}