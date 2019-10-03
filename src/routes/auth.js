import express from 'express';
import validateInputs from 'json-request-validator';
import AuthController from '../controllers/AuthController';
import trimInputs from '../middlewares/trimInputs';
import { registerRules, loginRules } from '../middlewares/validationRules';

/**
 * Routes of '/auth'
 */
const authRouter = express.Router();

authRouter.route('/signup').post(trimInputs, validateInputs(registerRules), AuthController.signup);
authRouter.route('/login').post(trimInputs, validateInputs(loginRules), AuthController.login);

export default authRouter;
