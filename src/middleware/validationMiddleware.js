const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation error",
        data: error.details.map((d) => d.message.replace(/"/g, ""))
      });
    } else {
      req[property] = value;
      next();
    }
  };
};

export default validate;
