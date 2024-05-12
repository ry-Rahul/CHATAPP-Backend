import { compare } from "bcrypt";
import User from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// create a new user and save it in cookie and database
const newUser = async (req, res, next) => {
  const { name, password, email } = req.body;

  if (!name || !password || !email)
    return next(new ErrorHandler("Please fill all the fields", 400));

  const userExists = await User.findOne({ email });
  if (userExists) return next(new ErrorHandler("User already exists", 400));

  const user = await User.create({
    name,
    password,
    email,
  });

  if (user) {
    sendToken(res, user, 201, "user created");
  } else {
    res.status(400);
    throw new ErrorHandler("Unable to create user", 400);
  }
};

// login route

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid Password", 404));

    // send the token in the cookie and send the response to the user
    sendToken(res, user, 200, "Welcome to the chat app");
  } catch (error) {
    next(error);
  }
};

// logout route
const logout = async (req, res) => {
  res
    .status(200)
    .cookie("chattApp", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
};

// get all users route
const getAllUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            {
              name: {
                $regex: req.query.search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: req.query.search,
                $options: "i",
              },
            },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.send(users);
    // console.log("search keyword is", keyword);
  } catch (error) {
    console.log("Error in getting all users", error);
    next(error);
  }
};

//  know the status of the user
const knowStatus = async (req, res, next) => {
  try {
    const { AVAILABLE } = req.body;
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const statusEnum = ["AVAILABLE", "BUSY"];
 
    if (AVAILABLE === true ) {
      user.onlineStatus = statusEnum[0];
    } 
    else {
      user.onlineStatus = statusEnum[1];
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.log("Error in updating status", error);
    return next(error);
  }
};


export { loginUser, newUser, logout, knowStatus, getAllUsers };
