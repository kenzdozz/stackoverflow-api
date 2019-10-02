import Response from '../helpers/Response';
import codes from '../helpers/statusCodes';

class Routes {
  constructor(app) {
    this.app = app;
  }

  initialize() {
    // this.app.post('/api/v1/farmer-input', Controller.farmerInput);

    this.app.get('/', (req, res) => Response.send(res, codes.success, {
      message: 'This app is running.',
    }));

    this.app.get('*', (req, res) => Response.send(res, codes.notFound, {
      error: 'Endpoint not found.',
    }));
  }
}

export default Routes;
