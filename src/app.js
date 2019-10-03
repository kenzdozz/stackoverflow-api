import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import CookieParser from 'cookie-parser';
import 'dotenv/config';
import Routes from './routes';
import Logger from './helpers/Logger';

class App {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 9090;

    morgan.token('date', () => new Date().toLocaleString());
    process.env.TZ = 'Africa/Lagos';

    this.app.use(cors());
    this.app.use(CookieParser());
    this.app.use(morgan(':date *** :method :: :url ** :response-time'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    new Routes(this.app).initialize();
  }

  boot() {
    this.app.listen(this.PORT, () => {
      Logger.log(`app running on http://localhost:${this.PORT}`);
    });
    return this.app;
  }
}

const app = new App().boot();

export default app;
