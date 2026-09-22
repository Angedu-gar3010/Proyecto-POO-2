import { Router } from 'express';
import { USER_ROLES } from '../user/user.constants.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { authorizeRoles } from '../../middlewares/validate.roles.js';
import { validateFields } from '../../middlewares/validate.fields.js';
import {
  levelIdValidator,
  createLevelValidator,
  updateLevelValidator
} from '../../middlewares/validators/level.validators.js';
import {
  getLevels,
  getLevelById,
  createLevel,
  updateLevel,
  deactivateLevel
} from './level.controller.js';

const router = Router();

router.get('/', validateJwt, getLevels);
router.get('/:id', validateJwt, levelIdValidator, validateFields, getLevelById);
router.post('/', validateJwt, authorizeRoles(USER_ROLES.ADMIN), createLevelValidator, validateFields, createLevel);
router.patch('/:id', validateJwt, authorizeRoles(USER_ROLES.ADMIN), updateLevelValidator, validateFields, updateLevel);
router.delete('/:id', validateJwt, authorizeRoles(USER_ROLES.ADMIN), levelIdValidator, validateFields, deactivateLevel);

export default router;
