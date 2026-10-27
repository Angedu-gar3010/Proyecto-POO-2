import { useState } from 'react';
import CampoFormulario from '../components/FormField.jsx';
import { solicitarApi } from '../services/api.js';
import { nombresRoles } from '../utils/roles.js';

export default function PaginaPerfil({
  usuario,
  alActualizar,
  alCambiarContrasena,
}) {
  const [guardando, establecerGuardando] = useState(false);
  const [cambiando, establecerCambiando] = useState(false);
  const [mensaje, establecerMensaje] = useState('');
  const [error, establecerError] = useState('');
  const [errorContrasena, establecerErrorContrasena] = useState('');

  async function guardarDatos(evento) {
    evento.preventDefault();

    if (guardando) return;

    const campos = new FormData(evento.currentTarget);

    establecerGuardando(true);
    establecerError('');
    establecerMensaje('');

    try {
      const respuesta = await solicitarApi('/users/me', {
        metodo: 'PATCH',
        datos: {
          name: campos.get('nombre'),
          username: campos.get('usuario'),
        },
      });

      alActualizar(respuesta.user);
      establecerMensaje('Tus datos se actualizaron correctamente.');
    } catch (fallo) {
      establecerError(fallo.message);
    } finally {
      establecerGuardando(false);
    }
  }

  async function cambiarContrasena(evento) {
    evento.preventDefault();

    if (cambiando) return;

    const campos = new FormData(evento.currentTarget);
    establecerErrorContrasena('');

    if (campos.get('nueva') !== campos.get('confirmacion')) {
      establecerErrorContrasena('Las contraseñas nuevas no coinciden.');
      return;
    }

    establecerCambiando(true);

    try {
      await solicitarApi('/users/me/password', {
        metodo: 'PATCH',
        datos: {
          currentPassword: campos.get('actual'),
          newPassword: campos.get('nueva'),
        },
      });

      alCambiarContrasena();
    } catch (fallo) {
      establecerErrorContrasena(fallo.message);
    } finally {
      establecerCambiando(false);
    }
  }

  return (
    <>
      <header className="titulo-pagina">
        <h1>Mi perfil</h1>
        <p>Actualiza tus datos y protege tu cuenta</p>
      </header>

      <div className="columnas-perfil">
        <form className="formulario-juego" onSubmit={guardarDatos}>
          <h2>Datos personales</h2>

          <CampoFormulario
            id="nombre-perfil"
            etiqueta="Nombre completo"
          >
            <input
              id="nombre-perfil"
              name="nombre"
              defaultValue={usuario.name}
              autoComplete="name"
              minLength={2}
              maxLength={50}
              required
            />
          </CampoFormulario>

          <CampoFormulario
            id="usuario-perfil"
            etiqueta="Nombre de usuario"
          >
            <input
              id="usuario-perfil"
              name="usuario"
              defaultValue={usuario.username}
              autoComplete="username"
              minLength={4}
              maxLength={20}
              required
            />
          </CampoFormulario>

          <p>
            Rol: <strong>{nombresRoles[usuario.role]}</strong>
          </p>

          <button className="boton-juego" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>

          {mensaje && <p role="status">{mensaje}</p>}
          {error && (
            <p className="error-juego" role="alert">{error}</p>
          )}
        </form>

        <form
          className="formulario-juego"
          onSubmit={cambiarContrasena}
        >
          <h2>Cambiar contraseña</h2>

          <CampoFormulario
            id="actual"
            etiqueta="Contraseña actual"
          >
            <input
              id="actual"
              name="actual"
              type="password"
              autoComplete="current-password"
              required
            />
          </CampoFormulario>

          <CampoFormulario id="nueva" etiqueta="Nueva contraseña">
            <input
              id="nueva"
              name="nueva"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={64}
              required
            />
          </CampoFormulario>

          <CampoFormulario
            id="confirmacion"
            etiqueta="Confirmar nueva contraseña"
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

          <p className="detalle-nivel">
            De 8 a 64 caracteres, con mayúscula, minúscula y número.
            Al cambiarla, tendrás que iniciar sesión nuevamente.
          </p>

          <button className="boton-juego" disabled={cambiando}>
            {cambiando ? 'Actualizando…' : 'Actualizar contraseña'}
          </button>

          {errorContrasena && (
            <p className="error-juego" role="alert">
              {errorContrasena}
            </p>
          )}
        </form>
      </div>
    </>
  );
}