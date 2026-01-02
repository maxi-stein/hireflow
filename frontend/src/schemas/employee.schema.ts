import Joi from 'joi';

export const createEmployeeSchema = Joi.object({
  first_name: Joi.string().min(2).required().messages({
    'string.min': 'First name must be at least 2 characters',
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),
  last_name: Joi.string().min(2).required().messages({
    'string.min': 'Last name must be at least 2 characters',
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email({ tlds: false }).required().messages({
    'string.email': 'Invalid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  position: Joi.string().min(2).required().messages({
    'string.min': 'Position is required',
    'string.empty': 'Position is required',
    'any.required': 'Position is required',
  }),
  roles: Joi.array().min(1).required().messages({
    'array.min': 'Select at least one role',
    'any.required': 'Select at least one role',
  }),
});
