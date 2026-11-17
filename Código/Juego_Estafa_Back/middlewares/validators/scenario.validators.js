import { body, param } from 'express-validator';
import Nivel from '../../src/level/level.model.js';
import { SCENARIO_TYPE_VALUES } from '../../src/scenario/scenario.constants.js';
import { permitirCampos } from './auth.validators.js';

export const validacionesIdEscenario = [
  param('id').isMongoId(),
];

const campos = [
  'title',
  'description',
  'type',
  'level',
  'order',
  'content',
  'isFraud',
  'signals',
  'explanation',
  'recommendation',
  'points',
  'active',
];

const limitesContenido = {
  sender: 120,
  recipient: 120,
  subject: 180,
  message: 5000,
  url: 500,
  fileName: 180,
  imageUrl: 1000,
};

function reglasEscenario(opcional = false) {
  const campo = (nombre) => (
    opcional ? body(nombre).optional() : body(nombre)
  );

  return [
    permitirCampos(campos),

    campo('title')
      .isString().bail().trim()
      .isLength({ min: 2, max: 120 }),

    campo('description')
      .isString().bail().trim()
      .isLength({ min: 10, max: 500 }),

    campo('type').isIn(SCENARIO_TYPE_VALUES),

    campo('level')
      .isMongoId()
      .bail()
      .custom(async (id) => {
        if (!await Nivel.exists({ _id: id })) {
          throw new Error('El nivel no existe');
        }

        return true;
      }),

    campo('order').isInt({ min: 1 }).toInt(),

    campo('content')
      .isObject()
      .bail()
      .custom((contenido) => {
        if (
          typeof contenido.message !== 'string' ||
          !contenido.message.trim()
        ) {
          throw new Error('El mensaje es obligatorio');
        }

        for (const [nombre, valor] of Object.entries(contenido)) {
          if (
            !Object.hasOwn(limitesContenido, nombre) ||
            typeof valor !== 'string' ||
            valor.length > limitesContenido[nombre]
          ) {
            throw new Error(`Campo de contenido inválido: ${nombre}`);
          }
        }

        return true;
      }),

    campo('isFraud')
      .custom((valor) => typeof valor === 'boolean'),

    campo('signals')
      .isArray({ min: 1, max: 50 })
      .bail()
      .custom((senales) => {
        const textos = new Set();
        const identificadores = new Set();

        for (const senal of senales) {
          if (
            !senal ||
            typeof senal.text !== 'string' ||
            !senal.text.trim() ||
            senal.text.length > 250 ||
            typeof senal.isCorrect !== 'boolean'
          ) {
            throw new Error(
              'Cada señal necesita texto e isCorrect booleano',
            );
          }

          const texto = senal.text.trim().toLowerCase();

          if (textos.has(texto)) {
            throw new Error('No repitas el texto de una señal');
          }

          textos.add(texto);

          if (senal._id) {
            if (identificadores.has(senal._id)) {
              throw new Error('No repitas identificadores de señales');
            }

            identificadores.add(senal._id);
          }
        }

        return true;
      }),

    body('signals.*._id').optional().isMongoId(),

    campo('explanation')
      .isString().bail().trim()
      .isLength({ min: 10, max: 2000 }),

    campo('recommendation')
      .isString().bail().trim()
      .isLength({ min: 10, max: 2000 }),

    body('points').optional().isInt({ min: 0 }).toInt(),
    body('active').optional().isBoolean().toBoolean(),
  ];
}

export const validacionesCrearEscenario = reglasEscenario();

export const validacionesActualizarEscenario = [
  ...validacionesIdEscenario,
  ...reglasEscenario(true),
];