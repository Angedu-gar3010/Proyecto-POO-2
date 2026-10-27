import { Schema, model } from 'mongoose';
import { ROLES } from './user.constants.js';

const esquemaUsuario = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 4,
    maxlength: 20,
    match: /^[a-z0-9._-]+$/,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
    select: false,
  },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (_documento, usuario) => {
      delete usuario.password;
      delete usuario.tokenVersion;
      delete usuario.profile;
      return usuario;
    },
  },
});

export default model('User', esquemaUsuario);