import mongoose, { Schema, model, Types } from "mongoose";

const chatSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    users: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);
export { Chat };
