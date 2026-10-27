import { Schema, model } from 'mongoose';
import { ROLES_JUGADOR } from '../user/user.constants.js';

const esquemaNivel = new Schema({
  number: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  requiredScore: {
    type: Number,
    default: 0,
    min: 0,
  },
  roles: {
    type: [{ type: String, enum: ROLES_JUGADOR }],
    validate: {
      validator: (roles) => roles.length > 0,
      message: 'Asigna al menos un rol de jugador',
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Level', esquemaNivel);