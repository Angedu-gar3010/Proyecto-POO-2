import SecurityPanel from './SecurityPanel.jsx';

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <main className="page-shell">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="form-panel">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 20 5v6c0 5.2-3.4 9.3-8 11-4.6-1.7-8-5.8-8-11V5l8-3Z" />
                <path d="m8.7 12 2.1 2.1 4.7-5" />
              </svg>
            </span>
            <span>Juego AntiEstafas</span>
          </div>

          <div className="form-heading">
            <p className="eyebrow">{eyebrow}</p>
            <h1 id="auth-title">{title}</h1>
            <p>{description}</p>
          </div>

          {children}
        </div>

        <SecurityPanel />
      </section>
    </main>
  );
}