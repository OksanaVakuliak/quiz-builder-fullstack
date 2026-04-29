const validateSchema = (schema, payload) => {
  if (!schema) {
    return null;
  }

  const result = schema.safeParse(payload);

  if (!result.success) {
    return { error: result.error };
  }

  return { data: result.data };
};

const validateRequest = ({ body, params, query } = {}) => {
  return (req, _res, next) => {
    const bodyValidation = validateSchema(body, req.body);
    if (bodyValidation?.error) {
      return next(bodyValidation.error);
    }

    const paramsValidation = validateSchema(params, req.params);
    if (paramsValidation?.error) {
      return next(paramsValidation.error);
    }

    const queryValidation = validateSchema(query, req.query);
    if (queryValidation?.error) {
      return next(queryValidation.error);
    }

    if (bodyValidation?.data) {
      req.body = bodyValidation.data;
    }

    if (paramsValidation?.data) {
      req.params = paramsValidation.data;
    }

    if (queryValidation?.data) {
      req.query = queryValidation.data;
    }

    return next();
  };
};

module.exports = validateRequest;
