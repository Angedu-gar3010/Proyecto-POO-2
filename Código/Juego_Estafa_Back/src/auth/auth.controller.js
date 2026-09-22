import User from '../user/user.model.js';
import { USER_ROLES } from '../user/user.constants.js';
import { encrypt, checkPassword } from '../../utils/encrypt.js';
import { generateJwt } from '../../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      profile
    } = req.body;

    const hashedPassword = await encrypt(password);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      profile,
      role: USER_ROLES.USER
    });

    const token = generateJwt({
      uid: user._id.toString(),
      role: user.role
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'El nombre de usuario ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar el usuario'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    if (!user.status) {
      return res.status(403).json({
        success: false,
        message: 'La cuenta está desactivada'
      });
    }

    const validPassword = await checkPassword(
      user.password,
      password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const token = generateJwt({
      uid: user._id.toString(),
      role: user.role
    });

    return res.status(200).json({
      success: true,
      message: `Bienvenido, ${user.name}`,
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al iniciar sesión'
    });
  }
};