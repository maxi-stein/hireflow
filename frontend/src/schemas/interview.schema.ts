import Joi from "joi";

export const scheduleInterviewSchema = Joi.object({
  applicationIds: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one application is required",
    "any.required": "Application is required",
  }),
  interviewerIds: Joi.array().min(1).required().messages({
    "array.min": "At least one interviewer is required",
    "array.base": "At least one interviewer is required",
  }),
  type: Joi.string().valid("INDIVIDUAL", "GROUP").required().messages({
    "any.only": "Interview type must be INDIVIDUAL or GROUP",
    "string.empty": "Interview type is required",
  }),
  scheduledTime: Joi.date().required().messages({
    "date.base": "Valid date and time is required",
    "any.required": "Date and time is required",
  }),
  meetingLink: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Meeting link must be a valid URL",
  }),
});
