require('../../infrastructure/environment');
require('../../providers/passport');

const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');

const MongoDBConnection = require('../../infrastructure/database/mongodb/Connection');
const routes = require('./routes');

const routeNotFound = require('./middlewares/routeNotFound');
const errorHandler = require('./middlewares/errorHandler');

class App {
  constructor() {
    this.express = express();

    this.connect();
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  // eslint-disable-next-line class-methods-use-this
  connect() {
    MongoDBConnection.connect();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());

    this.express.use(
      cookieSession({
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.PASSPORT_SESSION_COOKIE_KEY]
      })
    );

    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }

  routes() {
    this.express.use(routes);
  }

  errorHandlers() {
    this.express.use(routeNotFound);
    this.express.use(errorHandler);
  }
}

module.exports = new App().express;