const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
const errorMiddleware = (err, req, res, next) => {
  console.log(err.message, err.statusCode);
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate field - ${error}`;
    err.statusCode = 400;
  }

  if (err.code='ETIMEDOUT') {
    err.message = `Request Timeout`;
    err.statusCode = 408;
  }

  return res.status(err.statusCode).json({
    success: false, 
    message: err.message,
  });
};
export { errorMiddleware , notFound};
