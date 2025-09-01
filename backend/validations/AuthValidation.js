// backend/validations/AuthValidation.js
import vine from "@vinejs/vine";

export const registerSchema = vine.object({
	fullName: vine.string().trim().minLength(3).maxLength(190),

	email: vine.string().trim().email(),

	phone: vine
		.string()
		.trim()
		.regex(/^\+8801[3-9]\d{8}$/) // BD number: +8801[3-9]XXXXXXXX
		.optional(),

	password: vine.string().trim().minLength(6).maxLength(100).confirmed(),
	password_confirmation: vine.string(),

	address: vine.string().maxLength(300).optional(),

	role: vine.enum(["STUDENT", "SYSTEM_ADMIN", "INSTITUTION_ADMIN"]),

	dob: vine.date({ formats: { utc: true } }),

	profile: vine.string().url().optional(),

	// Additional student-specific fields
	examPath: vine.enum(["NATIONAL", "MADRASHA"]).optional(),
	medium: vine.enum(["Bangla", "English", "Arabic"]).optional(),

	// SSC
	sscRoll: vine.string().maxLength(50).optional(),
	sscRegistration: vine.string().maxLength(50).optional(),
	sscGpa: vine.number().min(0).max(5).optional(),
	sscYear: vine.number().min(1900).max(new Date().getFullYear()).optional(),
	sscBoard: vine.string().maxLength(50).optional(),

	// HSC
	hscRoll: vine.string().maxLength(50).optional(),
	hscRegistration: vine.string().maxLength(50).optional(),
	hscGpa: vine.number().min(0).max(5).optional(),
	hscYear: vine.number().min(1900).max(new Date().getFullYear()).optional(),
	hscBoard: vine.string().maxLength(50).optional(),

	// Dakhil
	dakhilRoll: vine.string().maxLength(50).optional(),
	dakhilRegistration: vine.string().maxLength(50).optional(),
	dakhilGpa: vine.number().min(0).max(5).optional(),
	dakhilYear: vine
		.number()
		.min(1900)
		.max(new Date().getFullYear())
		.optional(),
	dakhilBoard: vine.string().maxLength(50).optional(),

	// Alim
	alimRoll: vine.string().maxLength(50).optional(),
	alimRegistration: vine.string().maxLength(50).optional(),
	alimGpa: vine.number().min(0).max(5).optional(),
	alimYear: vine.number().min(1900).max(new Date().getFullYear()).optional(),
	alimBoard: vine.string().maxLength(50).optional(),
});

export const loginSchema = vine.object({
	email: vine.string().trim().email(),
	password: vine.string(),
});

export const adminLoginSchema = vine.object({
  email: vine.string().trim().email(),
  password: vine.string(),
});

export const createInstitutionAdminSchema = vine.object({
  email: vine.string().trim().email(),
  password: vine.string().trim().minLength(6).maxLength(100).confirmed(),
  password_confirmation: vine.string(),
  institutionId: vine.string().trim(),
});
