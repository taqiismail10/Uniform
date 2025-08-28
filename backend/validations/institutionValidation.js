// backend/validations/institutionValidation.js

import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();


export const institutionSystemSchema = vine.object({
  name: vine.string().trim().minLength(3).maxLength(150),
  categoryName: vine.string().trim().optional(),
  description: vine.string().trim().maxLength(2000).optional(),
  address: vine.string().trim().maxLength(500).optional(),
  phone: vine.string().trim().maxLength(20).optional(),
  email: vine.string().trim().email().optional(),
  website: vine.string().url().optional(),
  establishedYear: vine
    .number()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
  logoUrl: vine.string().url().optional(),
});
