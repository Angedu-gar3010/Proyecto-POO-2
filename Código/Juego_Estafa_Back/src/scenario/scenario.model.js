import { Schema, model } from 'mongoose';
import { SCENARIO_TYPE_VALUES } from './scenario.constants.js';

const contentSchema = new Schema(
  {
    sender: { type: String, trim: true, maxlength: 120 },
    recipient: { type: String, trim: true, maxlength: 120 },
    subject: { type: String, trim: true, maxlength: 180 },
    message: {
      type: String,
      required: [true, 'El mensaje del escenario es obligatorio'],
      trim: true,
      maxlength: [5000, 'El mensaje no puede superar 5000 caracteres']
    },
    url: { type: String, trim: true, maxlength: 500 },
    fileName: { type: String, trim: true, maxlength: 180 },
    imageUrl: { type: String, trim: true, maxlength: 1000 }
  },
  { _id: false }
);

const signalSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, 'El texto de la señal es obligatorio'],
      trim: true,
      maxlength: [250, 'La señal no puede superar 250 caracteres']
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  { versionKey: false }
);

const scenarioSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: [120, 'El título no puede superar 120 caracteres']
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: [500, 'La descripción no puede superar 500 caracteres']
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: SCENARIO_TYPE_VALUES,
        message: 'El tipo de escenario no es válido'
      }
    },
    level: {
      type: Schema.Types.ObjectId,
      ref: 'Level',
      required: [true, 'El nivel es obligatorio'],
      index: true
    },
    order: {
      type: Number,
      required: [true, 'El orden es obligatorio'],
      min: [1, 'El orden debe ser mayor que cero']
    },
    content: {
      type: contentSchema,
      required: [true, 'El contenido es obligatorio']
    },
    isFraud: {
      type: Boolean,
      required: [true, 'Debes indicar si el escenario es fraudulento']
    },
    signals: {
      type: [signalSchema],
      validate: {
        validator: (signals) => signals.length > 0 && signals.some((signal) => signal.isCorrect),
        message: 'Debe existir al menos una señal y una debe ser correcta'
      }
    },
    explanation: {
      type: String,
      required: [true, 'La explicación es obligatoria'],
      trim: true,
      maxlength: [2000, 'La explicación no puede superar 2000 caracteres']
    },
    recommendation: {
      type: String,
      required: [true, 'La recomendación es obligatoria'],
      trim: true,
      maxlength: [2000, 'La recomendación no puede superar 2000 caracteres']
    },
    points: {
      type: Number,
      default: 10,
      min: [0, 'Los puntos no pueden ser negativos']
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

scenarioSchema.index({ level: 1, order: 1 }, { unique: true });

export default model('Scenario', scenarioSchema);
