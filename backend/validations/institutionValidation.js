// backend/validations/institutionValidation.js

import vine from "@vinejs/vine";
import { CustomErrorReporter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorReporter();


export const institutionSystemSchema = vine.object({
  name: vine.string().trim().minLength(3).maxLength(150),
  categoryName: vine.string().trim().optional(),
});
