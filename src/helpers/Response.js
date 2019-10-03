import codes from './statusCodes';
import Logger from './Logger';

class Response {
  static send(res, status, data) {
    return res.status(status).send({
      status,
      ...data,
    });
  }

  static handleError(res, error = {}) {
    Logger.log(error);
    return Response.send(res, codes.serverError, {
      error: 'Internal server error',
    });
  }
}

export default Response;
