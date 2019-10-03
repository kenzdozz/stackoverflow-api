import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import TokenUtil from '../helpers/TokenUtil';

/**
 * Checks if user is authenticated
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const authenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.authorization;

    if (!token) {
      return Response.send(res, codes.unAuthorized, {
        error: 'Authorization is required.',
      });
    }

    const user = TokenUtil.verify(token);
    if (!user) {
      return Response.send(res, codes.unAuthorized, {
        error: 'Provided authorization is invalid or has expired.',
      });
    }

    req.user = user;
    return next();
  } catch (error) { return Response.handleError(res, error); }
};

export default authenticated;
