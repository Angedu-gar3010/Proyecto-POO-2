import { useState } from 'react';
import VentanaModal from './ventanaModal'

export default function EstructuraJuego({
  alVerNiveles,
  alVerPerfil,
  alCerrarSesion,
  children,
}) {
  const [instrucciones, establecerInstrucciones] = useState(false);

  return (
    <div className="pantalla-juego">
      <div className="contenedor-juego">
        <nav
          className="acciones-sesion"
          aria-label="Navegación principal"
        >
          <button onClick={alVerNiveles}>Niveles</button>

          <button onClick={() => establecerInstrucciones(true)}>
            Instrucciones
          </button>

          <button onClick={alVerPerfil}>Perfil</button>
          <button onClick={alCerrarSesion}>Cerrar sesión</button>
        </nav>

        <main className="panel-juego">{children}</main>
      </div>

      {instrucciones && (
        <VentanaModal
          titulo="Cómo jugar"
          alCerrar={() => establecerInstrucciones(false)}
        >
          <ol className="lista-instrucciones">
            <li>Selecciona un nivel disponible para tu rol.</li>
            <li>
              Lee el escenario y decide si es seguro o fraudulento.
            </li>
            <li>
              Marca todas las señales de alerta correctas. Si ninguna
              corresponde, déjalas sin marcar.
            </li>
            <li>
              Confirma tu respuesta. En los niveles iniciales ganas
              10 puntos cuando aciertas la clasificación y todas las
              señales, sin marcar opciones incorrectas.
            </li>
            <li>
              Lee la explicación y continúa. Cada respuesta confirmada
              queda guardada, incluso si fue incorrecta.
            </li>
          </ol>

          <p>
            Puedes salir y continuar después. Hay un único progreso por
            nivel; una respuesta confirmada no se puede cambiar.
          </p>

          <p>
            Al finalizar: 3 estrellas por acertar todo; 2 desde un 66%;
            1 por algún acierto; 0 si no hubo aciertos.
          </p>

          <p>
            El administrador consulta los niveles y no participa como
            jugador.
          </p>
        </VentanaModal>
      )}
    </div>
  );
}