import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';
import authRouter from './auth';

class Routes {
  constructor(app) {
    this.app = app;
  }

  initialize() {
    this.app.use('/api/v1/auth', authRouter);

    this.app.get('/', (req, res) => Response.send(res, codes.success, {
      message: 'This app is running.',
    }));

    this.app.get('*', (req, res) => Response.send(res, codes.notFound, {
      error: 'Endpoint not found.',
    }));
  }
}

export default Routes;
