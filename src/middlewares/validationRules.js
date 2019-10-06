import User from '../database/models/User';


const registerRules = {
  displayName: 'required',
  email: {
    rules: 'required|email|unique',
    unique: {
      async exists(email) {
        const e = await User.findOne({ email });
        return !!e;
      },
    },
  },
  password: {
    rules: 'required|minlen',
    minlen: 8,
  },
};

const loginRules = {
  email: 'required|email',
  password: 'required',
};

const quesRules = {
  title: 'required',
  body: 'required',
  notify: {
    rules: 'belongsto',
    belongsto: [true, false],
  },
};

const ansRules = {
  body: 'required',
};

const voteRules = {
  id: 'required',
  vote: {
    rules: 'required|belongsto',
    belongsto: [-1, 0, 1],
  },
};

export {
  registerRules, loginRules, quesRules, ansRules, voteRules,
};
