import PanelSeguridad from './SecurityPanel.jsx';

export default function EstructuraAutenticacion({
  encabezado,
  titulo,
  descripcion,
  children,
}) {
  return (
    <main className="page-shell">
      <section
        className="auth-card"
        aria-labelledby="titulo-autenticacion"
      >
        <div className="form-panel">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 20 5v6c0 5-3 9-8 11-5-2-8-6-8-11V5Z" />
                <path d="m8 12 3 3 5-6" />
              </svg>
            </span>
            <span>Juego AntiEstafas</span>
          </div>

          <div className="form-heading">
            <p className="eyebrow">{encabezado}</p>
            <h1 id="titulo-autenticacion">{titulo}</h1>
            <p>{descripcion}</p>
          </div>

          {children}
        </div>

        <PanelSeguridad />
      </section>
    </main>
  );
}