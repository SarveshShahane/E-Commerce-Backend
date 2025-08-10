import Joi from 'joi';

export const createPaymentIntentSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string()
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
          .required()
          .messages({
            'number.base': 'Quantity must be a valid number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1',
            'number.max': 'Quantity cannot exceed 99',
            'any.required': 'Quantity is required'
          })
      }).required()
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      'array.base': 'Items must be an array',
      'array.min': 'At least one item is required',
      'array.max': 'Cannot process more than 50 items at once',
      'any.required': 'Items are required'
    }),
  
  currency: Joi.string()
    .valid('usd', 'eur', 'gbp', 'inr', 'cad', 'aud')
    .default('inr')
    .messages({
      'any.only': 'Currency must be one of: USD, EUR, GBP, INR, CAD, AUD'
    }),
  
  customer_id: Joi.string()
    .pattern(/^cus_[a-zA-Z0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Customer ID is required',
      'string.pattern.base': 'Customer ID must be a valid Stripe customer ID',
      'any.required': 'Customer ID is required'
    })
});

export const attachPaymentMethodSchema = Joi.object({
  customer_id: Joi.string()
    .pattern(/^cus_[a-zA-Z0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Customer ID is required',
      'string.pattern.base': 'Customer ID must be a valid Stripe customer ID',
      'any.required': 'Customer ID is required'
    }),
  
  payment_method_id: Joi.string()
    .pattern(/^pm_[a-zA-Z0-9]+$/)
    .required()
    .messages({
      'string.empty': 'Payment Method ID is required',
      'string.pattern.base': 'Payment Method ID must be a valid Stripe payment method ID',
      'any.required': 'Payment Method ID is required'
    })
});
