const { body, validationResult } = require("express-validator");
//post
exports.validateUser = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),
 
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must contain only letters"),
 
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email is required"),
 
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isNumeric()
    .withMessage("Phone number must be numeric"),

    body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength:6,
      minLowercase:1,
      minUppercase:1,
      minSymbols:1,
    })
    .withMessage("Password must be at least 6 characters long and include at least 1 lowercase letter,1 uppercase letter,1 number and 1 symbol"),
 
  body("role")
    .optional()
    .isIn(["Admin", "SuperAdmin"])
    .withMessage("Role must be either Admin or Superadmin"),
];
//put
exports.validateUserUpdate = [
  body("firstName")
    .optional()
    .isAlpha()
    .withMessage("First name must contain only letters"),

  body("lastName")
    .optional()
    .isAlpha()
    .withMessage("Last name must contain only letters"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required"),
  
  body("phoneNumber")
    .optional()
    .isNumeric()
    .withMessage("Phone number must be numeric"),

];
 
exports.handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => err.msg),
    });
  }
  next();
};