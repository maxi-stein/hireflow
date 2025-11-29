import Joi from 'joi';
import { WorkMode } from '../services/job-offer.service';

export const createJobOfferSchema = Joi.object({
  position: Joi.string().min(2).required().messages({
    'string.min': 'Position must have at least 2 letters',
    'string.empty': 'Position is required',
  }),
  location: Joi.string().min(2).required().messages({
    'string.min': 'Location must have at least 2 letters',
    'string.empty': 'Location is required',
  }),
  work_mode: Joi.string().valid(...Object.values(WorkMode)).required().messages({
    'any.only': 'Invalid work mode selected',
    'string.empty': 'Work mode is required',
  }),
  description: Joi.string().min(10).required().messages({
    'string.min': 'Description must be at least 10 characters',
    'string.empty': 'Description is required',
  }),
  salary: Joi.string().allow('').optional(),
  benefits: Joi.string().allow('').optional(),
  skills: Joi.array().items(Joi.string()).optional(),
});
