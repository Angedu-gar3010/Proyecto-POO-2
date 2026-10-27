import { Schema, model } from 'mongoose';
import { SCENARIO_TYPE_VALUES } from './scenario.constants.js';

const esquemaContenido = new Schema({
  sender: { type: String, trim: true, maxlength: 120 },
  recipient: { type: String, trim: true, maxlength: 120 },
  subject: { type: String, trim: true, maxlength: 180 },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000,
  },
  url: { type: String, maxlength: 500 },
  fileName: { type: String, maxlength: 180 },
  imageUrl: { type: String, maxlength: 1000 },
}, { _id: false });

const esquemaSenal = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const esquemaEscenario = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  type: {
    type: String,
    required: true,
    enum: SCENARIO_TYPE_VALUES,
  },
  level: {
    type: Schema.Types.ObjectId,
    ref: 'Level',
    required: true,
    index: true,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
  },
  content: {
    type: esquemaContenido,
    required: true,
  },
  isFraud: {
    type: Boolean,
    required: true,
  },
  signals: {
    type: [esquemaSenal],
    validate: {
      validator: (senales) => senales.length > 0,
      message: 'Incluye opciones de señales',
    },
  },
  explanation: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  recommendation: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  points: {
    type: Number,
    default: 10,
    min: 0,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

esquemaEscenario.index(
  { level: 1, order: 1 },
  { unique: true },
);

export default model('Scenario', esquemaEscenario);