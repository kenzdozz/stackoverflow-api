import express from 'express';
import validateInputs from 'json-request-validator';
import trimInputs from '../middlewares/trimInputs';
import { quesRules, ansRules } from '../middlewares/validationRules';
import QuestionController from '../controllers/QuestionController';
import authenticated from '../middlewares/authentication';
import AnswerController from '../controllers/AnswerController';

/**
 * Routes of '/auth'
 */
const quesRouter = express.Router();

quesRouter.route('/').post(authenticated, trimInputs, validateInputs(quesRules), QuestionController.ask);
quesRouter.route('/').get(QuestionController.viewAll);
quesRouter.route('/:id').get(QuestionController.viewOne);
quesRouter.route('/:id').post(authenticated, trimInputs, validateInputs(ansRules), AnswerController.reply);

export default quesRouter;
