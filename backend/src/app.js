const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./config/logger');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const corsOptions = {
  origin:
    env.CORS_ORIGIN === '*'
      ? '*'
      : env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
