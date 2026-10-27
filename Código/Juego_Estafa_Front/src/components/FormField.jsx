export default function CampoFormulario({
  id,
  etiqueta,
  children,
}) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="input-wrap">{children}</div>
    </div>
  );
}