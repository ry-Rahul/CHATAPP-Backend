import { Chat } from "../models/chat.js";
import User from "../models/user.js";
import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../utils/utility.js";

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new ErrorHandler("User Id is required", 400);
  }

//   user id is req.user
  var isChat = await Chat.find({
    users: { $all: [req.user, userId] },
    $and: [
      { users: { $elemMatch: { $eq: req.user } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      name: "sender",
      users: [req.user, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      throw new ErrorHandler("Unable to create chat", 400);
    } 
  }
});


const fetchChats = asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
        throw new ErrorHandler("Unable to fetch chats", 400);
    }
  });
export { accessChat , fetchChats};
