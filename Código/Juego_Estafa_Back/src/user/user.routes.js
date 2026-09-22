import { Router } from 'express';
import {
  getMe,
  updateMe,
  updatePassword
} from './user.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js';
import { validateFields } from '../../middlewares/validate.fields.js';
import {
  updateUserValidator,
  updatePasswordValidator
} from '../../middlewares/validators/user.validators.js';

const router = Router();

router.get(
  '/me',
  validateJwt,
  getMe
);

router.patch(
  '/me',
  validateJwt,
  updateUserValidator,
  validateFields,
  updateMe
);

router.patch(
  '/me/password',
  validateJwt,
  updatePasswordValidator,
  validateFields,
  updatePassword
);

export default router;