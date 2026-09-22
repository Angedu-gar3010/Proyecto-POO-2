import { Schema, model } from 'mongoose';
import {
  USER_ROLES,
  USER_ROLE_VALUES,
  USER_PROFILES,
  USER_PROFILE_VALUES
} from './user.constants.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede superar 50 caracteres']
    },

    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [4, 'El usuario debe tener al menos 4 caracteres'],
      maxlength: [20, 'El usuario no puede superar 20 caracteres']
    },

    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      select: false
    },

    profile: {
      type: String,
      enum: {
        values: USER_PROFILE_VALUES,
        message: 'El perfil seleccionado no es válido'
      },
      default: USER_PROFILES.OTRO
    },

    role: {
      type: String,
      enum: {
        values: USER_ROLE_VALUES,
        message: 'El rol no es válido'
      },
      default: USER_ROLES.USER
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_document, returnedObject) => {
        delete returnedObject.password;
        return returnedObject;
      }
    }
  }
);

export default model('User', userSchema);