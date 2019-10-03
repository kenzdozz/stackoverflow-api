/**
 * Trims input in req.body
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const trimInputs = (req, res, next) => {
  const keys = Object.keys(req.body);
  // eslint-disable-next-line no-restricted-syntax
  for (const index of keys) {
    req.body[index] = typeof req.body[index] === 'string'
      ? req.body[index].trim() : req.body[index];
  }
  next();
};

export default trimInputs;
