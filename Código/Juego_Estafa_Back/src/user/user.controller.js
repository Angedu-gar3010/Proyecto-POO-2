import User from './user.model.js';
import {
  protegerContrasena,
  verificarContrasena
} from '../../utils/encrypt.js';

export const obtenerMiPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error al consultar usuario:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al consultar el usuario'
    });
  }
};

export const actualizarMiPerfil = async (req, res) => {
  try {
    const updateData = {
      ...req.body
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'El nombre de usuario ya está registrado'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar el usuario'
    });
  }
};

export const actualizarContrasena = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findById(req.user.id)
      .select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const validPassword = await verificarContrasena(
      user.password,
      currentPassword
    );

    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    user.password = await protegerContrasena(newPassword);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar la contraseña'
    });
  }
};