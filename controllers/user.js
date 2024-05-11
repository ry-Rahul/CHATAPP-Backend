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

    if (!email || !password)
      return next(new ErrorHandler("Please fill all the fields", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("User is not Available", 404));
    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid Password", 404));

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
      ? { $or: [{ name: { $regex: req.query.search, $options: "i" } }] }
      : {};
    // console.log("search keyword is", keyword);
  } catch (error) {
    console.log("Error in getting all users", error);
    next(error);
  }
};

// search user route
const searchUser = async (req, res, next) => {
  try {
    const { name = "" } = req.query;

    const myChats = await Chat.find();
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Finding all users except me and my friends
    const allUsersExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromMyChats },
      name: { $regex: name, $options: "i" },
    });
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
    res.status(200).json({
      success: true,
      message: users,
    });
  } catch (error) {
    console.log("Error in searching user", error);
    next(error);
  }
};

export { loginUser, newUser, logout, searchUser, getAllUsers };
