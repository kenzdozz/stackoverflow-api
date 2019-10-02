/**
 * Vote model - To store Vote
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const voteSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  on: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel',
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Question', 'Answer'],
  },
}, {
  timestamps: true,
});

const Vote = mongoose.model('Vote', voteSchema);

export default Vote;
