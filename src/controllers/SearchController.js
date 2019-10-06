import Question from '../database/models/Question';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import User from '../database/models/User';
import Answer from '../database/models/Answer';

class SearchController {
  static async search(req, res) {
    const { search } = req.query;
    const regSearch = { $regex: new RegExp(search, 'i') };

    try {
      const questions = await Question.find({
        $or: [{ title: regSearch }, { body: regSearch }],
      }).select('title body');

      const users = await User.find({ displayName: regSearch }).select('displayName email');
      const answers = await Answer.find({ displayName: regSearch }).select('body');

      return Response.send(res, codes.success, {
        data: { questions, users, answers },
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

export default SearchController;
