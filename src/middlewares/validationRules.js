const registerRules = {
  displayName: 'required',
  email: 'required|email',
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
  notify: 'boolean',
};

export {
  registerRules, loginRules, quesRules,
};
