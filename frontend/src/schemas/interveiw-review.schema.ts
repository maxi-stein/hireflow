import Joi from "joi";

export const interviewReviewSchema = Joi.object({
  score: Joi.number().min(1).max(10).required().messages({
    "number.min": "Score must be at least 1",
    "number.max": "Score must be at most 10",
    "any.required": "Score is required",
  }),
  notes: Joi.string().allow('').optional(),
  strengths: Joi.array().items(Joi.string()).optional(),
  weaknesses: Joi.array().items(Joi.string()).optional(),
});
