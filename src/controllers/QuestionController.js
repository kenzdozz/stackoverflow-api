import Question from '../database/models/Question';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import User from '../database/models/User';
import { validateMongoID } from '../helpers/utils';

class QuestionController {
  static async ask(req, res) {
    const { title, body, notify } = req.body;
    const { user } = req;

    try {
      let question = new Question({
        title,
        body,
        notify,
        author: user._id,
      });
      await question.save();
      await User.updateOne({ _id: user._id }, { $push: { questions: question._id } });
      question = await Question.findById(question._id).populate('author', 'displayName email');

      return Response.send(res, codes.success, {
        data: question,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  static async viewAll(req, res) {
    try {
      const questions = await Question.find({}).populate('author', 'displayName email');

      return Response.send(res, codes.success, {
        data: questions,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  static async viewOne(req, res) {
    const { id } = req.params;

    if (!validateMongoID(id)) {
      return Response.send(res, codes.notFound, {
        error: 'Question not found.',
      });
    }

    try {
      const question = await Question.findById(id).populate('author', 'displayName email').populate('answers', 'body voteCount accepted ');
      if (!question) {
        return Response.send(res, codes.notFound, {
          error: 'Question not found.',
        });
      }

      return Response.send(res, codes.success, {
        data: question,
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

export default QuestionController;
