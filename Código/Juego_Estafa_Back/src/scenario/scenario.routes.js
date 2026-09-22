import { Router } from 'express';
import { USER_ROLES } from '../user/user.constants.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { authorizeRoles } from '../../middlewares/validate.roles.js';
import { validateFields } from '../../middlewares/validate.fields.js';
import {
  scenarioIdValidator,
  levelIdParamValidator,
  createScenarioValidator,
  updateScenarioValidator
} from '../../middlewares/validators/scenario.validators.js';
import {
  getScenariosByLevel,
  getScenarioById,
  getScenariosForAdmin,
  createScenario,
  updateScenario,
  deactivateScenario
} from './scenario.controller.js';

const router = Router();

router.get('/level/:levelId', validateJwt, levelIdParamValidator, validateFields, getScenariosByLevel);
router.get('/admin', validateJwt, authorizeRoles(USER_ROLES.ADMIN), getScenariosForAdmin);
router.get('/:id', validateJwt, scenarioIdValidator, validateFields, getScenarioById);
router.post('/', validateJwt, authorizeRoles(USER_ROLES.ADMIN), createScenarioValidator, validateFields, createScenario);
router.patch('/:id', validateJwt, authorizeRoles(USER_ROLES.ADMIN), updateScenarioValidator, validateFields, updateScenario);
router.delete('/:id', validateJwt, authorizeRoles(USER_ROLES.ADMIN), scenarioIdValidator, validateFields, deactivateScenario);

export default router;
