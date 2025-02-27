const jwt = require("jsonwebtoken");

//Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; //Extract the token from request headers
  if (!token) {
    const error = new Error("Unauthorized: No token provided");
    error.statuscode = 401;
    return next(error); //Forward error to next middleware
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //Verify JWT token
    req.user = decoded; //Attach decoded user data to request
    next(); //Proceed to the next middleware
  } catch (error) {
    error.message = "Invalid token";
    error.statuscode = 403;
    return next(error);
  }
};

//Middleware to log requests with timestamps
const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

//Error handling middleware for centralized error responses
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${status} - ${message}`); //Log error details
  res.status(status).json({ status, message }); //Send error response
};

module.exports = { isAuthenticated, logRequests, errorHandler };
