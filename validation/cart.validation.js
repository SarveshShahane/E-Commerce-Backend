import Joi from 'joi';

export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Product ID is required',
      'string.pattern.base': 'Product ID must be a valid MongoDB ObjectId',
      'any.required': 'Product ID is required'
    }),
  
  quantity: Joi.number()
    .integer()
    .min(1)
    .max(99)
    .default(1)
    .messages({
      'number.base': 'Quantity must be a valid number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
      'number.max': 'Quantity cannot exceed 99'
    })
});

export const mongoIdSchema = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.empty': 'ID is required',
    'string.pattern.base': 'ID must be a valid MongoDB ObjectId',
    'any.required': 'ID is required'
  });

export const productIdParamSchema = Joi.object({
  productId: mongoIdSchema
});
