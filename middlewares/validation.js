import Joi from 'joi';

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    req[property] = value;
    next();
  };
};

export const validateObjectId = (paramName = 'id') => {
  const schema = Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': `${paramName} is required`,
      'string.pattern.base': `${paramName} must be a valid MongoDB ObjectId`,
      'any.required': `${paramName} is required`
    });

  return validate(schema, 'params');
};

export const validateFileUpload = (options = {}) => {
  const {
    maxFiles = 5,
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize = 5 * 1024 * 1024  
  } = options;

  return (req, res, next) => {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one file is required'
      });
    }

    if (files.length > maxFiles) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${maxFiles} files allowed`
      });
    }

    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        });
      }

      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size too large. Maximum size: ${maxSize / (1024 * 1024)}MB`
        });
      }
    }

    next();
  };
};

export const validateQuery = (schema) => {
  return validate(schema, 'query');
};

export const validateParams = (schema) => {
  return validate(schema, 'params');
};
