const { body, validationResult } = require("express-validator");

exports.validateLead = [
    body("firstName")
        .notEmpty()
        .withMessage("First name is required")
        .isAlpha()
        .withMessage("First name must contain only letters"),

    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("websiteURL")
        .notEmpty()
        .withMessage("Website URL is required")
        .bail()
        .isURL()
        .withMessage("Valid website URL is required"),

    body("linkdinURL")
        .notEmpty()
        .withMessage("LinkedIn URL is required")
        .bail()
        .isURL()
        .withMessage("Valid LinkedIn URL is required"),

    body("industry")
        .notEmpty()
        .withMessage("Industry is required"),

    body("whatsUpNumber")
        .notEmpty()
        .withMessage("WhatsApp number is required")
        .bail()
        .isNumeric()
        .withMessage("WhatsApp number must be numeric"),

    body("status")
        .optional()
        .isIn(["ACTIVE", "INACTIVE"])
        .withMessage("Status must be one of: ACTIVE, INACTIVE"),

    body("workEmail")
        .notEmpty()
        .withMessage("Work email is required")
        .bail()
        .isEmail()
        .withMessage("Enter a valid work email"),

    body("priority")
        .optional()
        .isIn(["HIGH", "MEDIUM", "LOW"])
        .withMessage("Priority must be one of: HIGH, MEDIUM, LOW"),

    body("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .bail()
        .isMongoId()
        .withMessage("Invalid User ID")
];

exports.handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((err) => err.msg)
        });
    }
    next();
};
