// backend/utils/validation.js
const { validationResult } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateSpot = (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const errors = {};

  if (!address) errors.address = "Street address is required";
  if (!city) errors.city = "City is required";
  if (!state) errors.state = "State is required";
  if (!country) errors.country = "Country is required";
  if (lat < -90 || lat > 90) errors.lat = "Latitude must be within -90 and 90";
  if (lng < -180 || lng > 180) errors.lng = "Longitude must be within -180 and 180";
  if (!name || name.length > 50) errors.name = "Name must be less than 50 characters";
  if (!description) errors.description = "Description is required";
  if (price <= 0) errors.price = "Price per day must be a positive number";

  if (Object.keys(errors).length > 0) {
      return res.status(400).json({
          "message": "Validation error",
          "errors": errors
      })
  }
  next();
}

const validateReview = (req, res, next) => {
  const { review, stars } = req.body;
  const errors = {};
  if (!review) errors.review = "Review text is required";
  if (!stars || stars < 1 || stars > 5) errors.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(errors).length > 0) {
      return res.status(400).json({
          "message": "Validation error",
          "errors": errors
      })
  }
  next();
}

module.exports = {
  handleValidationErrors, 
  validateReview,
  validateSpot
};