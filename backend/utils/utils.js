import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { errors } from "@vinejs/vine";
import prisma from "../DB/db.config.js";

/**
 * Utility functions for common operations across the application
 */
class Utility {
  /**
   * Convert string to title case
   * @param {string} str - String to convert
   * @returns {string} - Title cased string
   */
  static toTitleCase(str) {
    if (!str || typeof str !== "string") return "";

    return str
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Hash password with bcrypt
   * @param {string} password - Plain text password
   * @param {number} saltRounds - Salt rounds (default: 12)
   * @returns {Promise<string>} - Hashed password
   */
  static async hashPassword(password, saltRounds = 12) {
    if (!password || typeof password !== "string") {
      throw new Error("Password must be a valid string");
    }

    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} - Comparison result
   */
  static async comparePassword(password, hash) {
    if (!password || !hash) {
      throw new Error("Password and hash are required");
    }

    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT token
   * @param {object} payload - Token payload
   * @param {string} expiresIn - Token expiration (default: 24h)
   * @returns {string} - JWT token
   */
  static generateJWTToken(payload, expiresIn = null) {
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload must be a valid object");
    }

    const options = {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN || "24h",
    };

    return jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token to verify
   * @returns {object} - Decoded token payload
   */
  static verifyJWTToken(token) {
    if (!token) {
      throw new Error("Token is required");
    }

    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Generate random string
   * @param {number} length - Length of random string (default: 32)
   * @param {string} charset - Character set to use
   * @returns {string} - Random string
   */
  static generateRandomString(
    length = 32,
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  ) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate UUID v4 (alternative to Prisma's uuid())
   * @returns {string} - UUID v4
   */
  static generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Validation result
   */
  static isValidEmail(email) {
    if (!email || typeof email !== "string") return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Normalize email (trim and lowercase)
   * @param {string} email - Email to normalize
   * @returns {string} - Normalized email
   */
  static normalizeEmail(email) {
    if (!email || typeof email !== "string") return "";

    return email.trim().toLowerCase();
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Validation result
   */
  static isValidPhone(phone) {
    if (!phone || typeof phone !== "string") return false;

    const phoneRegex = /^[\+]?[0-9\-\(\)\s]{7,20}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @param {object} options - Validation options
   * @returns {object} - Validation result with details
   */
  static validatePasswordStrength(password, options = {}) {
    const {
      minLength = 8,
      maxLength = 255,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true,
    } = options;

    const result = {
      isValid: true,
      errors: [],
    };

    if (!password || typeof password !== "string") {
      result.isValid = false;
      result.errors.push("Password must be a string");
      return result;
    }

    if (password.length < minLength) {
      result.isValid = false;
      result.errors.push(
        `Password must be at least ${minLength} characters long`
      );
    }

    if (password.length > maxLength) {
      result.isValid = false;
      result.errors.push(`Password must not exceed ${maxLength} characters`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
      result.isValid = false;
      result.errors.push("Password must contain at least one uppercase letter");
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
      result.isValid = false;
      result.errors.push("Password must contain at least one lowercase letter");
    }

    if (requireNumbers && !/\d/.test(password)) {
      result.isValid = false;
      result.errors.push("Password must contain at least one number");
    }

    if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
      result.isValid = false;
      result.errors.push(
        "Password must contain at least one special character (@$!%*?&)"
      );
    }

    return result;
  }

  /**
   * Sanitize string input
   * @param {string} input - String to sanitize
   * @param {object} options - Sanitization options
   * @returns {string} - Sanitized string
   */
  static sanitizeString(input, options = {}) {
    if (!input || typeof input !== "string") return "";

    const {
      trim = true,
      removeExtraSpaces = true,
      removeSpecialChars = false,
      allowedChars = null,
    } = options;

    let result = input;

    if (trim) {
      result = result.trim();
    }

    if (removeExtraSpaces) {
      result = result.replace(/\s+/g, " ");
    }

    if (removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    if (allowedChars) {
      const regex = new RegExp(`[^${allowedChars}]`, "g");
      result = result.replace(regex, "");
    }

    return result;
  }

  /**
   * Format date to readable string
   * @param {Date|string} date - Date to format
   * @param {string} format - Format type (default: 'full')
   * @returns {string} - Formatted date string
   */
  static formatDate(date, format = "full") {
    if (!date) return "";

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const options = {
      full: {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
      date: {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
      time: {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      },
      short: {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      },
    };

    return dateObj.toLocaleDateString("en-US", options[format] || options.full);
  }

  /**
   * Calculate age from date of birth
   * @param {Date|string} dob - Date of birth
   * @returns {number} - Age in years
   */
  static calculateAge(dob) {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 0;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return Math.max(0, age);
  }

  /**
   * Paginate array
   * @param {Array} array - Array to paginate
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Items per page
   * @returns {object} - Paginated result
   */
  static paginateArray(array, page = 1, limit = 10) {
    if (!Array.isArray(array)) {
      throw new Error("First parameter must be an array");
    }

    const offset = (page - 1) * limit;
    const paginatedItems = array.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(array.length / limit),
        totalItems: array.length,
        itemsPerPage: limit,
        hasNextPage: offset + limit < array.length,
        hasPrevPage: page > 1,
      },
    };
  }

  /**
   * Remove sensitive fields from object
   * @param {object} obj - Object to clean
   * @param {Array} fieldsToRemove - Fields to remove
   * @returns {object} - Cleaned object
   */
  static removeSensitiveFields(
    obj,
    fieldsToRemove = ["password", "token", "secret"]
  ) {
    if (!obj || typeof obj !== "object") return obj;

    const cleaned = { ...obj };

    fieldsToRemove.forEach((field) => {
      delete cleaned[field];
    });

    return cleaned;
  }

  /**
   * Handle common controller errors
   * @param {Error} error - Error object
   * @param {object} res - Express response object
   * @returns {object} - Error response
   */
  static handleControllerError(error, res) {
    console.error("Controller Error:", error);

    // Validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: error.messages,
      });
    }

    // Prisma errors
    if (error.code) {
      switch (error.code) {
        case "P2002":
          return res.status(409).json({
            status: 409,
            message: "Resource already exists",
            field: error.meta?.target?.[0] || "unknown",
          });

        case "P2025":
          return res.status(404).json({
            status: 404,
            message: "Resource not found",
          });

        case "P2003":
          return res.status(400).json({
            status: 400,
            message: "Foreign key constraint violation",
          });

        case "P2014":
          return res.status(400).json({
            status: 400,
            message: "Invalid ID provided",
          });

        default:
          console.error("Unhandled Prisma error:", error);
          break;
      }
    }

    // JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 401,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        message: "Token expired",
      });
    }

    // Default server error
    return res.status(500).json({
      status: 500,
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message || "Something went wrong",
    });
  }

  /**
   * Create standardized API response
   * @param {object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {any} data - Response data
   * @param {object} meta - Additional metadata
   * @returns {object} - API response
   */
  static createApiResponse(res, statusCode, message, data = null, meta = null) {
    const response = {
      status: statusCode,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== null) {
      response.data = data;
    }

    if (meta !== null) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Validate UUID format
   * @param {string} uuid - UUID to validate
   * @returns {boolean} - Validation result
   */
  static isValidUUID(uuid) {
    if (!uuid || typeof uuid !== "string") return false;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Deep clone object
   * @param {any} obj - Object to clone
   * @returns {any} - Cloned object
   */
  static deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => this.deepClone(item));
    if (typeof obj === "object") {
      const cloned = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          cloned[key] = this.deepClone(obj[key]);
        }
      }
      return cloned;
    }
    return obj;
  }

  /**
   * Convert string to slug
   * @param {string} text - Text to convert
   * @returns {string} - Slug
   */
  static createSlug(text) {
    if (!text || typeof text !== "string") return "";

    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  /**
   * Check if value is empty (null, undefined, empty string, empty array, empty object)
   * @param {any} value - Value to check
   * @returns {boolean} - Is empty
   */
  static isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  }
}

export default Utility;
