import { hash, verify } from 'argon2';

export const protegerContrasena = async (password) => {
  return hash(password);
};

export const verificarContrasena = async (
  hashedPassword,
  plainPassword
) => {
  return verify(hashedPassword, plainPassword);
};