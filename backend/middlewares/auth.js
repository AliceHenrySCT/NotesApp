const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res,next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    const error = new Error("Unauthorized: No token provided");
    error.statuscode = 401;
    return next(error);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    error.message = "Invalid token";
    error.statuscode = 403;
    return next(error);
  }
};

const logRequests = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

const errorHandler = (err,req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    //Log the error for debugging purposes
    console.error(`[Error] ${status} - ${message}`);
    //Respond to the client
    res.status(status).json({ status, message });
};

module.exports = { isAuthenticated, logRequests, errorHandler };
