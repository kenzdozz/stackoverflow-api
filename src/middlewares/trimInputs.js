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
    if (typeof req.body[index] === 'string') req.body[index] = req.body[index].trim();
  }
  next();
};

export default trimInputs;
