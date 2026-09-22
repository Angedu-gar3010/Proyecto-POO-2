import { Router } from 'express';
import {
  register,
  login
} from './auth.controller.js';
import {
  registerValidator,
  loginValidator
} from '../../middlewares/validators/auth.validators.js';
import { validateFields } from '../../middlewares/validate.fields.js';

const router = Router();

router.post(
  '/register',
  registerValidator,
  validateFields,
  register
);

router.post(
  '/login',
  loginValidator,
  validateFields,
  login
);

export default router;