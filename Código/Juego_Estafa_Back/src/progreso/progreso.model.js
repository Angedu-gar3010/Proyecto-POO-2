import { Schema, model } from 'mongoose';

const esquemaRespuesta = new Schema({
  escenario: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  esFraude: {
    type: Boolean,
    required: true,
  },
  senales: [Schema.Types.ObjectId],
  correcta: {
    type: Boolean,
    required: true,
  },
  puntos: {
    type: Number,
    required: true,
    min: 0,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const esquemaProgreso = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nivel: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    required: true,
  },

  // Copia del contenido al comenzar el nivel.
  // Las ediciones posteriores no cambian esta evaluación.
  escenarios: {
    type: [Schema.Types.Mixed],
    required: true,
  },

  respuestas: {
    type: [esquemaRespuesta],
    default: [],
  },
}, { timestamps: true });

esquemaProgreso.index(
  { usuario: 1, nivel: 1 },
  { unique: true },
);

export default model('Progreso', esquemaProgreso);