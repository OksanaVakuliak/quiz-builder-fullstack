const pino = require('pino-http');

const logger = pino({
  level: 'info',
  customSuccessMessage: (req, res, responseTime) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${Math.round(responseTime)}ms`;
  },
  customErrorMessage: (req, res, error) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${error?.message || 'Request failed'}`;
  },
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname,req,res,responseTime',
      errorLikeObjectKeys: ['err', 'error'],
    },
  },
});

module.exports = logger;
