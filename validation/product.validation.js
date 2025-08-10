import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 100 characters',
      'any.required': 'Product name is required'
    }),
  
  description: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .required()
    .messages({
      'string.empty': 'Product description is required',
      'string.min': 'Product description must be at least 10 characters long',
      'string.max': 'Product description cannot exceed 2000 characters',
      'any.required': 'Product description is required'
    }),
  
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
  
  category: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters',
      'any.required': 'Category is required'
    }),
  
  stock: Joi.number()
    .integer()
    .min(0)
    .max(99999)
    .required()
    .messages({
      'number.base': 'Stock must be a valid number',
      'number.integer': 'Stock must be a whole number',
      'number.min': 'Stock cannot be negative',
      'number.max': 'Stock cannot exceed 99,999',
      'any.required': 'Stock quantity is required'
    })
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 100 characters'
    }),
  
  description: Joi.string()
    .min(10)
    .max(2000)
    .trim()
    .messages({
      'string.min': 'Product description must be at least 10 characters long',
      'string.max': 'Product description cannot exceed 2000 characters'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .min(0.01)
    .max(999999.99)
    .messages({
      'number.base': 'Price must be a valid number',
      'number.positive': 'Price must be a positive number',
      'number.min': 'Price must be at least $0.01',
      'number.max': 'Price cannot exceed $999,999.99'
    }),
  
  category: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters'
    }),
  
  stock: Joi.number()
    .integer()
    .min(0)
    .max(99999)
    .messages({
      'number.base': 'Stock must be a valid number',
      'number.integer': 'Stock must be a whole number',
      'number.min': 'Stock cannot be negative',
      'number.max': 'Stock cannot exceed 99,999'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const productQuerySchema = Joi.object({
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
    .default(12)
    .messages({
      'number.base': 'Limit must be a valid number',
      'number.integer': 'Limit must be a whole number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  category: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category cannot exceed 50 characters'
    }),
  
  search: Joi.string()
    .min(1)
    .max(100)
    .trim()
    .messages({
      'string.min': 'Search term must be at least 1 character long',
      'string.max': 'Search term cannot exceed 100 characters'
    }),
  
  minPrice: Joi.number()
    .min(0)
    .max(999999.99)
    .messages({
      'number.base': 'Minimum price must be a valid number',
      'number.min': 'Minimum price cannot be negative',
      'number.max': 'Minimum price cannot exceed $999,999.99'
    }),
  
  maxPrice: Joi.number()
    .min(0)
    .max(999999.99)
    .greater(Joi.ref('minPrice'))
    .messages({
      'number.base': 'Maximum price must be a valid number',
      'number.min': 'Maximum price cannot be negative',
      'number.max': 'Maximum price cannot exceed $999,999.99',
      'number.greater': 'Maximum price must be greater than minimum price'
    })
});
