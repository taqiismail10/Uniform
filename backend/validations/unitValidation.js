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

  // Unit-level exam details
  examDate: vine.date({ formats: { utc: true } }).optional().nullable(),
  examTime: vine.string().maxLength(50).optional().nullable(),
  examCenter: vine.string().maxLength(100).optional().nullable(),

  requirements: vine
    .array(
      vine.object({
        sscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        hscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        minSscGPA: vine.number().min(0).max(5).optional().nullable(),
        minHscGPA: vine.number().min(0).max(5).optional().nullable(),
        minCombinedGPA: vine.number().min(0).max(10).optional().nullable(),
        minSscYear: vine.number().min(1990).max(2100).optional().nullable(),
        maxSscYear: vine.number().min(1990).max(2100).optional().nullable(),
        minHscYear: vine.number().min(1990).max(2100).optional().nullable(),
        maxHscYear: vine.number().min(1990).max(2100).optional().nullable(),
      })
    )
    .optional(),
});

export const updateUnitSchema = vine.object({
  name: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(50)
    .regex(/^[a-zA-Z0-9\s\-\.]+$/)
    .optional(),

  description: vine.string().maxLength(500).optional().nullable(),

  isActive: vine.boolean().optional(),

  applicationDeadline: vine
    .date({ formats: { utc: true } })
    .optional()
    .nullable(),

  maxApplications: vine.number().min(1).max(10000000).optional().nullable(),

  autoCloseAfterDeadline: vine.boolean().optional(),
  // Unit-level exam details
  examDate: vine.date({ formats: { utc: true } }).optional().nullable(),
  examTime: vine.string().maxLength(50).optional().nullable(),
  examCenter: vine.string().maxLength(100).optional().nullable(),
  requirements: vine
    .array(
      vine.object({
        sscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        hscStream: vine.enum(["SCIENCE", "ARTS", "COMMERCE"]),
        minSscGPA: vine.number().min(0).max(5).optional().nullable(),
        minHscGPA: vine.number().min(0).max(5).optional().nullable(),
        minCombinedGPA: vine.number().min(0).max(10).optional().nullable(),
        minSscYear: vine.number().min(1990).max(2100).optional().nullable(),
        maxSscYear: vine.number().min(1990).max(2100).optional().nullable(),
        minHscYear: vine.number().min(1990).max(2100).optional().nullable(),
        maxHscYear: vine.number().min(1990).max(2100).optional().nullable(),
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
  minSscYear: vine.number().min(1990).max(2100).optional().nullable(),
  maxSscYear: vine.number().min(1990).max(2100).optional().nullable(),
  minHscYear: vine.number().min(1990).max(2100).optional().nullable(),
  maxHscYear: vine.number().min(1990).max(2100).optional().nullable(),
});
