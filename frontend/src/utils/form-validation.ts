import type { FormErrors } from "@mantine/form";
import Joi from "joi";

export const validateWithJoi = (schema: Joi.Schema) => {
  return (values: unknown): FormErrors => {
    const result = schema.validate(values, { abortEarly: false });
    
    if (!result.error) {
      return {};
    }

    return result.error.details.reduce((acc, error) => {
      const path = error.path.join(".");
      acc[path] = error.message;
      return acc;
    }, {} as FormErrors);
  };
};
