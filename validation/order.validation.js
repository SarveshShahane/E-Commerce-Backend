import Joi from 'joi';

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled')
    .required()
    .messages({
      'string.empty': 'Status is required',
      'any.only': 'Status must be one of: Pending, Paid, Shipped, Delivered, Cancelled',
      'any.required': 'Status is required'
    })
});

export const orderIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.empty': 'Order ID is required',
    'string.pattern.base': 'Order ID must be a valid MongoDB ObjectId',
    'any.required': 'Order ID is required'
  });

export const orderQuerySchema = Joi.object({
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
  
  status: Joi.string()
    .valid('Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled')
    .messages({
      'any.only': 'Status must be one of: Pending, Paid, Shipped, Delivered, Cancelled'
    }),
  
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
});
