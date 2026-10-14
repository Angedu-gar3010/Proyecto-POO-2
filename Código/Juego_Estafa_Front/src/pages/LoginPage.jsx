import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import { login, saveSession } from '../services/auth.js';

export default function LoginPage({ onCreateAccount }) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (pending) return;

    const fields = new FormData(event.currentTarget);

    setPending(true);
    setFeedback(null);

    try {
      const data = await login({
        username: fields.get('username'),
        password: fields.get('password'),
      });

      saveSession(data, fields.has('remember'));

      setFeedback({
        type: 'success',
        message: data.message || 'Sesión iniciada correctamente.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Bienvenido de nuevo"
      title="Iniciar sesión"
      description="Continúa aprendiendo a protegerte en internet."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <FormField id="username" label="Nombre de usuario">
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
        </FormField>

        <FormField id="password" label="Contraseña" icon="lock">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Ingresa tu contraseña"
            required
          />
        </FormField>

        <label className="remember-option">
          <input type="checkbox" name="remember" />
          <span>Recordar mi sesión</span>
        </label>

        <button className="primary-button" type="submit" disabled={pending}>
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
        <button className="text-button" type="button" onClick={onCreateAccount}>
          Crear cuenta
        </button>
      </p>
    </AuthLayout>
  );
}