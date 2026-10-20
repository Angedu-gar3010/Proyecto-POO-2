import jwt from 'jsonwebtoken';

export const generarJwt = (payload) => {
  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY no está configurada');
  }

  return jwt.sign(
    payload,
    process.env.SECRET_KEY,
    {
      expiresIn: '3h',
      algorithm: 'HS256'
    }
  );
};