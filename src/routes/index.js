import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import authRouter from './auth';
import quesRouter from './questions';
import voteRouter from './votes';

class Routes {
  constructor(app) {
    this.app = app;
  }

  initialize() {
    this.app.use('/api/v1/auth', authRouter);
    this.app.use('/api/v1/questions', quesRouter);
    this.app.use('/api/v1/votes', voteRouter);

    this.app.get('/', (req, res) => Response.send(res, codes.success, {
      message: 'This app is running.',
    }));

    this.app.get('*', (req, res) => Response.send(res, codes.notFound, {
      error: 'Endpoint not found.',
    }));
  }
}

export default Routes;
