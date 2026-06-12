import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email is required",
    }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const registerSchema = Joi.object({
  first_name: Joi.string().min(2).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.empty": "El nombre es requerido",
    "any.required": "El nombre es requerido",
  }),
  last_name: Joi.string().min(2).required().messages({
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "string.empty": "El apellido es requerido",
    "any.required": "El apellido es requerido",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Formato de email inválido",
      "string.empty": "El email es requerido",
      "any.required": "El email es requerido",
    }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.empty": "La contraseña es requerida",
    "any.required": "La contraseña es requerida",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Las contraseñas no coinciden",
    "string.empty": "Confirmá tu contraseña",
    "any.required": "Confirmá tu contraseña",
  }),
});
