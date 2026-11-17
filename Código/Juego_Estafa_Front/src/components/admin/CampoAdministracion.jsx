import { useId } from 'react';

export default function CampoAdministracion({
  etiqueta,
  multilinea = false,
  ...propiedades
}) {
  const identificador = useId();

  return (
    <label className="campo-admin" htmlFor={identificador}>
      <span>{etiqueta}</span>

      {multilinea ? (
        <textarea
          id={identificador}
          rows={4}
          {...propiedades}
        />
      ) : (
        <input
          id={identificador}
          {...propiedades}
        />
      )}
    </label>
  );
}