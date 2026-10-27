import { useEffect, useState } from 'react';

import PaginaInicioSesion from './pages/LoginPage.jsx';
import PaginaRegistro from './pages/RegisterPage.jsx';
import PaginaNiveles from './pages/PaginaNiveles.jsx';
import PaginaPerfil from './pages/PaginaPerfil.jsx';
import PaginaJuego from './pages/PaginaJuego.jsx';
import EstructuraJuego from './components/EstructuraJuego.jsx';

import { solicitarApi } from './services/api.js';
import { obtenerToken, eliminarSesion } from './services/sesion.js';

import './styles/juego.css';

export default function Aplicacion() {
  const [usuario, establecerUsuario] = useState(null);
  const [pagina, establecerPagina] = useState('ingreso');
  const [nivel, establecerNivel] = useState(null);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState('');
  const [aviso, establecerAviso] = useState('');
  const [intento, establecerIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    async function recuperarSesion() {
      try {
        if (obtenerToken()) {
          const datos = await solicitarApi('/users/me', {
            senal: controlador.signal,
          });

          if (!controlador.signal.aborted) {
            establecerUsuario(datos.user);
            establecerPagina('niveles');
          }
        }
      } catch (fallo) {
        if (!controlador.signal.aborted && obtenerToken()) {
          establecerError(fallo.message);
        }
      } finally {
        if (!controlador.signal.aborted) {
          establecerCargando(false);
        }
      }
    }

    recuperarSesion();

    return () => controlador.abort();
  }, [intento]);

  useEffect(() => {
    function caducarSesion() {
      establecerUsuario(null);
      establecerNivel(null);
      establecerPagina('ingreso');
      establecerAviso(
        'Tu sesión terminó. Inicia sesión nuevamente.',
      );
    }

    window.addEventListener('sesion-caducada', caducarSesion);

    return () => {
      window.removeEventListener('sesion-caducada', caducarSesion);
    };
  }, []);

  function cerrarSesion(mensaje = '') {
    eliminarSesion();
    establecerUsuario(null);
    establecerNivel(null);
    establecerError('');
    establecerAviso(mensaje);
    establecerPagina('ingreso');
  }

  function autenticar(datosUsuario) {
    establecerUsuario(datosUsuario);
    establecerAviso('');
    establecerPagina('niveles');
  }

  function reintentar() {
    establecerError('');
    establecerCargando(true);
    establecerIntento((actual) => actual + 1);
  }

  if (cargando || error) {
    return (
      <main className="pantalla-espera">
        <section className="panel-espera" aria-live="polite">
          <h1>
            {cargando
              ? 'Verificando tu sesión…'
              : 'No pudimos recuperar tu sesión'}
          </h1>

          {error && (
            <>
              <p role="alert">{error}</p>

              <button
                className="boton-juego"
                onClick={reintentar}
              >
                Reintentar
              </button>

              <button
                className="enlace-juego"
                onClick={() => cerrarSesion()}
              >
                Volver al ingreso
              </button>
            </>
          )}
        </section>
      </main>
    );
  }

  if (!usuario) {
    return pagina === 'registro' ? (
      <PaginaRegistro
        alAutenticar={autenticar}
        alVolverAlInicioSesion={() => establecerPagina('ingreso')}
      />
    ) : (
      <PaginaInicioSesion
        aviso={aviso}
        alAutenticar={autenticar}
        alCrearCuenta={() => establecerPagina('registro')}
      />
    );
  }

  return (
    <EstructuraJuego
      alVerNiveles={() => establecerPagina('niveles')}
      alVerPerfil={() => establecerPagina('perfil')}
      alCerrarSesion={() => cerrarSesion()}
    >
      {pagina === 'perfil' ? (
        <PaginaPerfil
          usuario={usuario}
          alActualizar={establecerUsuario}
          alCambiarContrasena={() => cerrarSesion(
            'Contraseña actualizada. Inicia sesión nuevamente.',
          )}
        />
      ) : pagina === 'juego' && nivel ? (
        <PaginaJuego
          key={nivel.id}
          nivel={nivel}
          alVolver={() => establecerPagina('niveles')}
        />
      ) : (
        <PaginaNiveles
          usuario={usuario}
          alSeleccionar={(seleccionado) => {
            establecerNivel(seleccionado);
            establecerPagina('juego');
          }}
        />
      )}
    </EstructuraJuego>
  );
}