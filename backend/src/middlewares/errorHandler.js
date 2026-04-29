const { ZodError } = require('zod');
const logger = require('../config/logger');
const ApiError = require('../utils/apiError');

const getRequestContext = (req) => {
  return {
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  };
};

const errorHandler = (error, req, res, _next) => {
  const requestLogger = req.log || logger.logger;
  const requestContext = getRequestContext(req);

  if (error instanceof ZodError) {
    requestLogger.warn(
      {
        ...requestContext,
        issues: error.issues,
        err: error,
      },
      'Request validation failed',
    );

    return res.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed',
      details: error.issues,
    });
  }

  if (error instanceof ApiError) {
    requestLogger.warn(
      {
        ...requestContext,
        statusCode: error.statusCode,
        details: error.details || null,
        err: error,
      },
      'API error response',
    );

    return res.status(error.statusCode).json({
      error: 'ApiError',
      message: error.message,
      details: error.details || null,
    });
  }

  requestLogger.error(
    {
      ...requestContext,
      err: error,
    },
    'Unhandled server error',
  );

  return res.status(500).json({
    error: 'InternalServerError',
    message: 'Unexpected server error',
  });
};

module.exports = errorHandler;
