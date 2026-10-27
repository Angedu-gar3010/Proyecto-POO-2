export function crearError(estado, mensaje) {
  const error = new Error(mensaje);
  error.estado = estado;
  return error;
}