import { useState } from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import FormField from '../components/FormField.jsx';
import { register, saveSession } from '../services/auth.js';

export default function RegisterPage({ onBackToLogin }) {
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (pending) return;

    const fields = new FormData(event.currentTarget);
    const password = fields.get('password');
    const confirmation = fields.get('confirmPassword');

    if (password !== confirmation) {
      setFeedback({
        type: 'error',
        message: 'Las contraseñas no coinciden.',
      });
      return;
    }

    setPending(true);
    setFeedback(null);

    try {
      const data = await register({
        name: fields.get('name'),
        username: fields.get('username'),
        password,
        profile: fields.get('profile'),
      });

      saveSession(data);

      setFeedback({
        type: 'success',
        message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
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
      eyebrow="Empieza a aprender"
      title="Crear cuenta"
      description="Únete y aprende a identificar estafas en internet."
    >
      <form className="auth-form register-form" onSubmit={handleSubmit}>
        <FormField id="name" label="Nombre completo">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Ingresa tu nombre"
            minLength={2}
            maxLength={50}
            required
          />
        </FormField>

        <FormField id="username" label="Nombre de usuario">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Elige un usuario"
            minLength={4}
            maxLength={20}
            pattern="[A-Za-z0-9._-]{4,20}"
            title="Usa de 4 a 20 letras, números, puntos, guiones o guiones bajos."
            required
          />
        </FormField>

        <div className="field-group">
          <label htmlFor="profile">Perfil</label>
          <div className="input-wrap">
            <select id="profile" name="profile" defaultValue="OTRO">
              <option value="ESTUDIANTE">Estudiante</option>
              <option value="ADULTO_MAYOR">Adulto mayor</option>
              <option value="PERSONAL_ADMINISTRATIVO">
                Personal administrativo
              </option>
              <option value="OTRO">Otro</option>
            </select>
          </div>
        </div>

        <FormField id="password" label="Contraseña" icon="lock">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Crea una contraseña"
            minLength={8}
            maxLength={64}
            required
          />
        </FormField>

        <p className="field-hint">
          Mínimo 8 caracteres, con mayúscula, minúscula y número.
        </p>

        <FormField
          id="confirmPassword"
          label="Confirmar contraseña"
          icon="lock"
        >
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
            required
          />
        </FormField>

        <button className="primary-button" type="submit" disabled={pending}>
          {pending ? 'Creando cuenta...' : 'Crear cuenta'}
          {!pending && <span aria-hidden="true">→</span>}
        </button>

        {feedback && (
          <p className={`form-feedback ${feedback.type}`} role="status">
            {feedback.message}
          </p>
        )}
      </form>

      <p className="switch-copy">
        ¿Ya tienes una cuenta?{' '}
        <button className="text-button" type="button" onClick={onBackToLogin}>
          Iniciar sesión
        </button>
      </p>
    </AuthLayout>
  );
}