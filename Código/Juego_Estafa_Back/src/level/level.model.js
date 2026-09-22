import { Schema, model } from 'mongoose';

const levelSchema = new Schema(
  {
    number: {
      type: Number,
      required: [true, 'El número del nivel es obligatorio'],
      unique: true,
      min: [1, 'El número del nivel debe ser mayor que cero']
    },
    name: {
      type: String,
      required: [true, 'El nombre del nivel es obligatorio'],
      trim: true,
      maxlength: [80, 'El nombre no puede superar 80 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres']
    },
    requiredScore: {
      type: Number,
      default: 0,
      min: [0, 'El puntaje requerido no puede ser negativo']
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('Level', levelSchema);
