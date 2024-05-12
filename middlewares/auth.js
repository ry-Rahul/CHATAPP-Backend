
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";


const isAuthenticated = (req, res, next) => {
    try {
      const token = req.cookies["chattApp"];
      if (!token)
        return next(new ErrorHandler("Please login", 401));
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decodedData);
  
      req.user = decodedData._id;
  
      next();
    } catch (error) {
      next(new ErrorHandler("Please login to access this route", 401));
    }
  }; 

    export { isAuthenticated };