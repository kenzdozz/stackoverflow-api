import express from 'express';
import validateInputs from 'json-request-validator';
import trimInputs from '../middlewares/trimInputs';
import { quesRules } from '../middlewares/validationRules';
import QuestionController from '../controllers/QuestionController';
import authenticated from '../middlewares/authentication';

/**
 * Routes of '/auth'
 */
const quesRouter = express.Router();

quesRouter.route('/').post(authenticated, trimInputs, validateInputs(quesRules), QuestionController.ask);
quesRouter.route('/').get(QuestionController.viewAll);
quesRouter.route('/:id').get(QuestionController.viewOne);

export default quesRouter;
