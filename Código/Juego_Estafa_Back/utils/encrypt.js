import { hash, verify } from 'argon2';

export const encrypt = async (password) => {
  return hash(password);
};

export const checkPassword = async (
  hashedPassword,
  plainPassword
) => {
  return verify(hashedPassword, plainPassword);
};