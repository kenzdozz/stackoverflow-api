/**
 * User model - To store user data
 */
import { mongoose } from '../mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: { type: String, trim: true },
  email: { type: String, trim: true, unique: true },
  password: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  ansVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
  quesVotes: [{ type: Schema.Types.ObjectId, ref: 'Vote' }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
