import mongoose from "mongoose";

/**
 * Safely converts a value to MongoDB ObjectId
 * @param {string|ObjectId} value - Value to convert
 * @param {string} fieldName - Name of field for error messages
 * @returns {ObjectId} MongoDB ObjectId instance
 * @throws {Error} If value is invalid
 */
export const toObjectId = (value, fieldName = "ID") => {
    if (!value) {
        throw new Error(`${fieldName} is required`);
    }
    
    // If already an ObjectId, return as-is
    if (value instanceof mongoose.Types.ObjectId) {
        return value;
    }
    
    // Validate string format
    if (typeof value !== "string") {
        throw new Error(`${fieldName} must be a string or ObjectId`);
    }
    
    if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${fieldName} format: ${value}`);
    }
    
    return new mongoose.Types.ObjectId(value);
};

/**
 * Validates if a value is a valid ObjectId format
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid ObjectId format
 */
export const isValidObjectId = (value) => {
    if (!value) return false;
    return mongoose.Types.ObjectId.isValid(value);
};

/**
 * Safely converts ObjectId to string (handles both ObjectId and string)
 * @param {ObjectId|string} value - Value to convert
 * @returns {string} String representation
 */
export const toObjectIdString = (value) => {
    if (!value) return null;
    if (value instanceof mongoose.Types.ObjectId) {
        return value.toString();
    }
    if (typeof value === "string") {
        return value;
    }
    return String(value);
};
