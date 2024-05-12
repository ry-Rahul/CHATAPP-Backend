import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import User from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";

import OpenAI from "openai";
import dotenv from "dotenv";
import { set } from "mongoose";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function for sending message
// ___________________________________________________________________________________________
const mssg = async (content, chatId, req, res, recieverId , status) => {
  var newMessage = {
    sender: status === "BUSY" ? recieverId : req.user,
    reciever: recieverId,
    content: content,
    chat: chatId,
  };
  var message = await Message.create(newMessage);
  message = await message.populate("sender", "name");
  message = await message.populate("chat");
  message = await User.populate(message, {
    path: "chat.users",
    select: "name email",
  });

  await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

  res.json(message);
};
// send message ___________________________________________________________________________________________
const sendMessage = async (req, res, next) => {
  const { content, chatId, recieverId } = req.body;
  if (!content || !chatId || !recieverId) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const recieverUser = await User.findById({
    _id: recieverId,
  });

  let newMessage = "Busy";

  try {
    let gptmessage = "User is unavailable";
    let completionPromise = openai.chat.completions.create({
      messages: [{ role: "system", content: "User is unavailable" }],
      model: "gpt-3.5-turbo",
    });

    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("Timeout reached");
      }, 10000); 
    });

    const response = await Promise.race([completionPromise, timeoutPromise]);

    if (typeof response === "string" && response === "Timeout reached") {
      gptmessage = "User is busy right now.";
    } else {
      gptmessage = response.choices[0].message.content;
    }

    if (recieverUser.onlineStatus === "BUSY") {
      mssg(gptmessage, chatId, req, res, recieverId,"BUSY");
    } else {
      mssg(content, chatId, req, res, recieverId,"AVAILABLE");
    }
  } catch (error) {
    console.log("Error sending message", error);
    next(error);
  }
};


// get all messages ___________________________________________________________________________________________
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");

    //  console.log(messages);
    res.json(messages);
  } catch (error) {
    console.log("Error fetching messages", error);
    next(error);
  }
};

export { sendMessage, allMessages };
