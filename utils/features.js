import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import colors from "colors";


const cookieOptions = {      
    maxAge: 1 * 24 * 60 * 60 * 1000,
    sameSite: false,
    httpOnly: true,
    secure: true,
  };

  

const connectDb = (uri) => {
  mongoose
    .connect(uri, {
      dbName: "HirequotientChat",
    })
    .then((data) => {
      console.log(`Connected to the database ${data.connection.host}`.bgGreen.black);
    })
    .catch((err) => {
      console.log("Error connecting to the database", err);
      process.exit(); 
    });
};

// sendToken____________________________________________
const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  return res.status(code).cookie("chattApp", token, cookieOptions).json({
    success: true,
    name: user.name,
    email: user.email,
    message,
  });
};



export {
    connectDb,
    sendToken,
    cookieOptions
}
