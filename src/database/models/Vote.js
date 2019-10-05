/**
 * Vote model - To store Vote
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const voteSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
}, {
  timestamps: true,
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
