import express from 'express';
import validateInputs from 'json-request-validator';
import trimInputs from '../middlewares/trimInputs';
import { voteRules } from '../middlewares/validationRules';
import VoteController from '../controllers/VoteController';
import authenticated from '../middlewares/authentication';

/**
 * Routes of '/votes'
 */
const voteRouter = express.Router();

voteRouter.route('/question').post(authenticated, trimInputs, validateInputs(voteRules), VoteController.voteQues);
voteRouter.route('/answer').post(authenticated, trimInputs, validateInputs(voteRules), VoteController.voteAns);

export default voteRouter;
