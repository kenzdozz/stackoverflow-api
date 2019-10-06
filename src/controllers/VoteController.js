/* eslint-disable eqeqeq */
import Question from '../database/models/Question';
import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import User from '../database/models/User';
import { validateMongoID } from '../helpers/utils';
import Answer from '../database/models/Answer';
import Vote from '../database/models/Vote';

class VoteController {
  static async voteQues(req, res) {
    const { id: questionId, vote } = req.body;
    const { user } = req;

    if (!validateMongoID(questionId)) {
      return Response.send(res, codes.notFound, {
        error: 'Question not found.',
      });
    }

    try {
      const question = await Question.findById(questionId);
      if (!question) {
        return Response.send(res, codes.notFound, {
          error: 'Question not found.',
        });
      }
      if (question.author == user._id) {
        return Response.send(res, codes.badRequest, {
          error: 'Cannot not vote for your post.',
        });
      }

      let msg;
      let aVote = await Vote.findOne({ author: user._id, question: questionId, vote });
      if (aVote) {
        await aVote.remove();
        await User.updateOne({ _id: user._id }, { $pull: { quesVotes: aVote._id } });
        await Question.updateOne({ _id: questionId }, {
          $pull: { votes: aVote._id },
          $inc: { voteCount: 0 - vote },
        });
        msg = 'Un';
      } else {
        aVote = new Vote({ author: user._id, question: questionId, vote });
        await aVote.save();
        await User.updateOne({ _id: user._id }, { $push: { quesVotes: aVote._id } });
        await Question.updateOne({ _id: questionId }, {
          $push: { votes: aVote._id },
          $inc: { voteCount: vote },
        });
        msg = vote === 1 ? 'Up' : 'Down';
      }

      return Response.send(res, codes.success, {
        message: `${msg}voted successfully.`,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  static async voteAns(req, res) {
    const { id: answerId, vote } = req.body;
    const { user } = req;

    if (!validateMongoID(answerId)) {
      return Response.send(res, codes.notFound, {
        error: 'Answer not found.',
      });
    }

    try {
      const answer = await Answer.findById(answerId);
      if (!answer) {
        return Response.send(res, codes.notFound, {
          error: 'Answer not found.',
        });
      }
      if (answer.author == user._id) {
        return Response.send(res, codes.badRequest, {
          error: 'Cannot not vote for your post.',
        });
      }

      let msg;
      let aVote = await Vote.findOne({ author: user._id, answer: answerId, vote });
      if (aVote) {
        await aVote.remove();
        await User.updateOne({ _id: user._id }, { $pull: { ansVotes: aVote._id } });
        await Answer.updateOne({ _id: answerId }, {
          $pull: { votes: aVote._id },
          $inc: { voteCount: 0 - vote },
        });
        msg = 'Un';
      } else {
        aVote = new Vote({ author: user._id, answer: answerId, vote });
        await aVote.save();
        await User.updateOne({ _id: user._id }, { $push: { ansVotes: aVote._id } });
        await Answer.updateOne({ _id: answerId }, {
          $push: { votes: aVote._id },
          $inc: { voteCount: vote },
        });
        msg = vote === 1 ? 'Up' : 'Down';
      }

      return Response.send(res, codes.success, {
        message: `${msg}voted successfully.`,
      });
    } catch (error) { return Response.handleError(res, error); }
  }
}

export default VoteController;
