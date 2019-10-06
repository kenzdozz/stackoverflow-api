import Question from '../database/models/Question';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import User from '../database/models/User';
import { validateMongoID } from '../helpers/utils';
import Answer from '../database/models/Answer';
import sendMail from '../helpers/sendMail';
import Logger from '../helpers/Logger';

class AnswerController {
  static async reply(req, res) {
    const { id: questionId } = req.params;
    const { body } = req.body;
    const { user } = req;

    if (!validateMongoID(questionId)) {
      return Response.send(res, codes.notFound, {
        error: 'Question not found.',
      });
    }

    try {
      const question = await Question.findById(questionId).populate('author', 'displayName email');
      if (!question) {
        return Response.send(res, codes.notFound, {
          error: 'Question not found.',
        });
      }
      const answer = new Answer({
        body,
        author: user._id,
        question: questionId,
      });
      await answer.save();
      await User.updateOne({ _id: user._id }, { $push: { answers: answer._id } });
      await Question.updateOne({ _id: questionId }, { $push: { answers: answer._id } });

      if (question.notify) {
        const message = `Dear ${question.author.displayName}<br/> A new answer has been posted on your question ${question.title}.<br/>Thanks.`;
        try {
          sendMail(question.author.email, 'An answer posted for your question', message);
        } catch (err) { Logger.log(err); }
      }

      return Response.send(res, codes.success, {
        data: answer,
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

export default AnswerController;
