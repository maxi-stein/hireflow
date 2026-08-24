import Joi from 'joi';

export const educationSchema = Joi.object({
  institution: Joi.string().min(2).required().messages({
    'string.empty': 'Institution is required',
    'string.min': 'Institution must be at least 2 characters',
  }),
  degree_type: Joi.string().required().messages({
    'string.empty': 'Degree type is required',
  }),
  field_of_study: Joi.string().required().messages({
    'string.empty': 'Field of study is required',
  }),
  start_date: Joi.date().required().messages({
    'date.base': 'Start date is required',
  }),
  end_date: Joi.date().allow(null).optional(),
  current: Joi.boolean(),
  description: Joi.string().allow('').optional(),
});

export const workExperienceSchema = Joi.object({
  company: Joi.string().min(2).required().messages({
    'string.empty': 'Company is required',
    'string.min': 'Company must be at least 2 characters',
  }),
  position: Joi.string().min(2).required().messages({
    'string.empty': 'Position is required',
    'string.min': 'Position must be at least 2 characters',
  }),
  description: Joi.string().allow('').optional(),
  start_date: Joi.date().required().messages({
    'date.base': 'Start date is required',
  }),
  end_date: Joi.date().allow(null).optional(),
  current_job: Joi.boolean(),
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'string.empty': 'Old password is required',
  }),
  newPassword: Joi.string().min(8).max(128).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password cannot exceed 128 characters',
    'string.empty': 'New password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
    'string.empty': 'Confirm password is required',
  }),
});
