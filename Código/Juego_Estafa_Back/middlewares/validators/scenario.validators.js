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
        if (!await Nivel.exists({ _id: id, active: true })) {
          throw new Error('El nivel no existe o está inactivo');
        }
      }),

    campo('order').isInt({ min: 1 }).toInt(),

    campo('content')
      .isObject()
      .bail()
      .custom((contenido) => {
        if (
          typeof contenido.message !== 'string' ||
          !contenido.message.trim() ||
          contenido.message.length > 5000
        ) {
          throw new Error(
            'El contenido debe incluir un mensaje de 1 a 5000 caracteres',
          );
        }

        return true;
      }),

    campo('isFraud')
      .custom((valor) => typeof valor === 'boolean'),

    campo('signals')
      .isArray({ min: 1, max: 50 })
      .bail()
      .custom((senales) => {
        const invalidas = senales.some((senal) => (
          !senal ||
          typeof senal.text !== 'string' ||
          !senal.text.trim() ||
          senal.text.length > 250 ||
          typeof senal.isCorrect !== 'boolean'
        ));

        if (invalidas) {
          throw new Error(
            'Cada señal necesita texto e isCorrect booleano',
          );
        }

        return true;
      }),

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