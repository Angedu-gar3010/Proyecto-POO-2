export default function CampoFormulario({
  id,
  label,
  icon = 'user',
  children,
  action,
}) {
  return (
    <div className="field-group">
      <div className="label-row">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>

      <div className="input-wrap">
        {icon === 'lock' ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 21a8 8 0 0 0-16 0" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}

        {children}
      </div>
    </div>
  );
}