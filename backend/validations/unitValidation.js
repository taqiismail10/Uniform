// backend/validations/unitValidation.js
import vine from "@vinejs/vine";

export const createUnitSchema = vine.object({
  name: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(50)
    .regex(/^[a-zA-Z0-9\s\-\.]+$/),

  description: vine.string().maxLength(500).optional().nullable(),

  isActive: vine.boolean().optional(),

  applicationDeadline: vine
    .date({ formats: { utc: true } })
    .optional()
    .nullable(),

  maxApplications: vine.number().min(1).max(10000000).optional().nullable(),
  autoCloseAfterDeadline: vine.boolean().optional(), // Add this line

  requirements: vine
    .array(
      vine.object({
        sscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        hscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        minSscGPA: vine.number().min(0).max(5).optional().nullable(),
        minHscGPA: vine.number().min(0).max(5).optional().nullable(),
        minCombinedGPA: vine.number().min(0).max(10).optional().nullable(),
      })
    )
    .optional(),
});

export const updateUnitSchema = vine.object({
  name: vine
    .string()
    .trim()
    .minLength(2)
    .maxLength(100)
    .regex(/^[a-zA-Z0-9\s\-\.]+$/)
    .optional(),

  description: vine.string().maxLength(500).optional().nullable(),

  isActive: vine.boolean().optional(),

  applicationDeadline: vine.date().optional().nullable(),

  maxApplications: vine.number().min(1).max(10000000).optional().nullable(),

  autoCloseAfterDeadline: vine.boolean().optional(),
  // ADD THIS - Requirements field for updating
  requirements: vine
    .array(
      vine.object({
        sscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        hscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        minSscGPA: vine.number().min(0).max(5).optional().nullable(),
        minHscGPA: vine.number().min(0).max(5).optional().nullable(),
        minCombinedGPA: vine.number().min(0).max(10).optional().nullable(),
      })
    )
    .optional(),
});

export const requirementSchema = vine.object({
  sscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
  hscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
  minSscGPA: vine.number().min(0).max(5).optional().nullable(),
  minHscGPA: vine.number().min(0).max(5).optional().nullable(),
  minCombinedGPA: vine.number().min(0).max(10).optional().nullable(),
});
