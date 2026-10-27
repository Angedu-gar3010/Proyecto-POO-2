import { body, param } from 'express-validator';
import { ROLES_JUGADOR } from '../../src/user/user.constants.js';
import { permitirCampos } from './auth.validators.js';

export const validacionesIdNivel = [
  param('id').isMongoId().withMessage('Nivel inválido'),
];

const camposNivel = [
  'number',
  'name',
  'description',
  'requiredScore',
  'roles',
  'active',
];

function reglasNivel(opcional = false) {
  const campo = (nombre) => (
    opcional ? body(nombre).optional() : body(nombre)
  );

  return [
    permitirCampos(camposNivel),

    campo('number').isInt({ min: 1 }).toInt(),

    campo('name')
      .isString().bail().trim()
      .isLength({ min: 2, max: 80 }),

    campo('description')
      .isString().bail().trim()
      .isLength({ min: 10, max: 500 }),

    campo('roles').isArray({ min: 1, max: 3 }),
    body('roles.*').isIn(ROLES_JUGADOR),

    body('requiredScore').optional().isInt({ min: 0 }).toInt(),
    body('active').optional().isBoolean().toBoolean(),
  ];
}

export const validacionesCrearNivel = reglasNivel();

export const validacionesActualizarNivel = [
  ...validacionesIdNivel,
  ...reglasNivel(true),
];