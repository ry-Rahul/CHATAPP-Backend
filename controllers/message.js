import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import User from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";

const sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  var newMessage = {
    sender: req.user,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat")

    message = await User.populate(message, {
      path: "chat.users",
      select: "name email", 
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.log("Error sending message", error);
    next(error);
  }
};

const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    console.log("Error fetching messages", error);
    next(error); 
  }
};

export { sendMessage, allMessages };
