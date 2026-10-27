import { useEffect, useId, useRef } from 'react';

export default function VentanaModal({
  titulo,
  alCerrar,
  children,
}) {
  const referencia = useRef(null);
  const identificador = useId();

  useEffect(() => {
    const ventana = referencia.current;
    const anterior = document.body.style.overflow;

    ventana.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      ventana.close();
      document.body.style.overflow = anterior;
    };
  }, []);

  return (
    <dialog
      ref={referencia}
      className="ventana-modal"
      aria-labelledby={identificador}
      onCancel={(evento) => {
        evento.preventDefault();
        alCerrar();
      }}
    >
      <button
        type="button"
        className="cerrar-modal"
        aria-label="Cerrar instrucciones"
        onClick={alCerrar}
      >
        ×
      </button>

      <h2 id={identificador}>{titulo}</h2>

      {children}

      <button
        type="button"
        className="boton-juego"
        onClick={alCerrar}
      >
        Entendido
      </button>
    </dialog>
  );
}