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


export {
  registerRules, loginRules,
};
