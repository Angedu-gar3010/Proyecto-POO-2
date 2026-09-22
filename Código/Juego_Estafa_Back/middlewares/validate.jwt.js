import jwt from 'jsonwebtoken';
import User from '../src/user/user.model.js';

export const validateJwt = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido'
      });
    }

    const token = authorization.slice(7);

    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY,
      {
        algorithms: ['HS256']
      }
    );

    const user = await User.findById(decoded.uid);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'El usuario del token ya no existe'
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: 'La cuenta está desactivada'
      });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      profile: user.profile
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};