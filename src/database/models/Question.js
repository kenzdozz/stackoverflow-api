/**
 * Question model - To store questions
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const queSchema = new Schema({
  title: { type: String, trim: true },
  body: { type: String, trim: true },
  tags: Array,
  notify: { type: Boolean, default: false },
  answered: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  voteCount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Question = mongoose.model('Question', queSchema);

export default Question;
