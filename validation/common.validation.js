import Joi from 'joi';

export const patterns = {
  mongoId: /^[0-9a-fA-F]{24}$/,
  
  stripeCustomerId: /^cus_[a-zA-Z0-9]+$/,
  
  stripePaymentMethodId: /^pm_[a-zA-Z0-9]+$/,
  
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  
  phoneNumber: /^\+?[1-9]\d{1,14}$/,
  
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
};

export const commonSchemas = {
  mongoId: Joi.string()
    .pattern(patterns.mongoId)
    .required()
    .messages({
      'string.empty': 'ID is required',
      'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
      'any.required': 'ID is required'
    }),
  
  optionalMongoId: Joi.string()
    .pattern(patterns.mongoId)
    .messages({
      'string.pattern.base': 'ID must be a valid MongoDB ObjectId'
    }),
  
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  
  optionalEmail: Joi.string()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(patterns.strongPassword)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'any.required': 'Password is required'
    }),
  
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a valid number',
      'number.integer': 'Page must be a whole number',
      'number.min': 'Page must be at least 1'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a valid number',
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  dateRange: {
    startDate: Joi.date()
      .iso()
      .messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format'
      }),
    
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format',
        'date.greater': 'End date must be after start date'
      })
  },
  
  price: Joi.number()
    .positive()
    .precision(2)
    .min(0.01)
    .max(999999.99)
    .required()
    .messages({
      'number.base': 'Price must be a valid number',
      'number.positive': 'Price must be a positive number',
      'number.min': 'Price must be at least $0.01',
      'number.max': 'Price cannot exceed $999,999.99',
      'any.required': 'Price is required'
    }),
  
  quantity: Joi.number()
    .integer()
    .min(1)
    .max(99)
    .required()
    .messages({
      'number.base': 'Quantity must be a valid number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 99',
      'any.required': 'Quantity is required'
    }),
  
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .required()
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 10 characters long',
      'string.max': 'Description cannot exceed 2000 characters',
      'any.required': 'Description is required'
    })
};

export const createParamSchema = (paramName, schema = commonSchemas.mongoId) => {
  return Joi.object({
    [paramName]: schema
  });
};

export const createQuerySchema = (additionalFields = {}) => {
  return Joi.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    ...additionalFields
  });
};
