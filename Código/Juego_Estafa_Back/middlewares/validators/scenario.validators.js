import { body, param } from 'express-validator';
import Level from '../../src/level/level.model.js';
import { SCENARIO_TYPE_VALUES } from '../../src/scenario/scenario.constants.js';

const allowedFields = [
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
  'active'
];

const validateLevelExists = async (levelId) => {
  const exists = await Level.exists({ _id: levelId, active: true });
  if (!exists) throw new Error('El nivel no existe o está inactivo');
  return true;
};

const optionalScenarioFields = [
  body('title').optional().isString().trim().isLength({ min: 2, max: 120 }).withMessage('El título debe tener entre 2 y 120 caracteres'),
  body('description').optional().isString().trim().isLength({ min: 10, max: 500 }).withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('type').optional().isIn(SCENARIO_TYPE_VALUES).withMessage('El tipo de escenario no es válido'),
  body('level').optional().isMongoId().withMessage('El nivel no es válido').bail().custom(validateLevelExists),
  body('order').optional().isInt({ min: 1 }).withMessage('El orden debe ser un entero mayor que cero').toInt(),
  body('content').optional().isObject().withMessage('El contenido debe ser un objeto'),
  body('content.message').optional().isString().trim().isLength({ min: 1, max: 5000 }).withMessage('El mensaje debe tener entre 1 y 5000 caracteres'),
  body('isFraud').optional().isBoolean().withMessage('isFraud debe ser booleano').toBoolean(),
  body('signals').optional().isArray({ min: 1 }).withMessage('Debes enviar al menos una señal'),
  body('signals.*.text').optional().isString().trim().isLength({ min: 1, max: 250 }).withMessage('Cada señal debe tener entre 1 y 250 caracteres'),
  body('signals.*.isCorrect').optional().isBoolean().withMessage('isCorrect debe ser booleano').toBoolean(),
  body('explanation').optional().isString().trim().isLength({ min: 10, max: 2000 }).withMessage('La explicación debe tener entre 10 y 2000 caracteres'),
  body('recommendation').optional().isString().trim().isLength({ min: 10, max: 2000 }).withMessage('La recomendación debe tener entre 10 y 2000 caracteres'),
  body('points').optional().isInt({ min: 0 }).withMessage('Los puntos deben ser un entero no negativo').toInt(),
  body('active').optional().isBoolean().withMessage('active debe ser booleano').toBoolean()
];

export const scenarioIdValidator = [
  param('id').isMongoId().withMessage('El identificador del escenario no es válido')
];

export const levelIdParamValidator = [
  param('levelId').isMongoId().withMessage('El identificador del nivel no es válido')
];

export const createScenarioValidator = [
  body('title').exists({ values: 'falsy' }).withMessage('El título es obligatorio'),
  body('description').exists({ values: 'falsy' }).withMessage('La descripción es obligatoria'),
  body('type').exists({ values: 'falsy' }).withMessage('El tipo es obligatorio'),
  body('level').exists({ values: 'falsy' }).withMessage('El nivel es obligatorio'),
  body('order').exists({ values: 'falsy' }).withMessage('El orden es obligatorio'),
  body('content').exists().withMessage('El contenido es obligatorio'),
  body('content.message').exists({ values: 'falsy' }).withMessage('El mensaje es obligatorio'),
  body('isFraud').exists().withMessage('Debes indicar si es fraude'),
  body('signals').exists().withMessage('Las señales son obligatorias'),
  body('explanation').exists({ values: 'falsy' }).withMessage('La explicación es obligatoria'),
  body('recommendation').exists({ values: 'falsy' }).withMessage('La recomendación es obligatoria'),
  ...optionalScenarioFields,
  body().custom((value) => {
    const invalid = Object.keys(value).filter((field) => !allowedFields.includes(field));
    if (invalid.length) throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    return true;
  })
];

export const updateScenarioValidator = [
  ...scenarioIdValidator,
  body().custom((value) => {
    const fields = Object.keys(value);
    if (!fields.length) throw new Error('Debes enviar al menos un campo');
    const invalid = fields.filter((field) => !allowedFields.includes(field));
    if (invalid.length) throw new Error(`Campos no permitidos: ${invalid.join(', ')}`);
    return true;
  }),
  ...optionalScenarioFields
];
