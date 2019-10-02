/**
 * Answer model - To store Answers
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const ansSchema = new Schema({
  body: { type: String, trim: true },
  tags: Array,
  accepted: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  question: { type: Schema.Types.ObjectId, ref: 'Answer' },
  votes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
}, {
  timestamps: true,
});

const Answer = mongoose.model('Answer', ansSchema);

export default Answer;
