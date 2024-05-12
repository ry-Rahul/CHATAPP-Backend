import express from "express";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";
import { connectDb } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware, notFound } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import chats from "./data/data.js";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

connectDb(mongoUri); 

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


// routes__________________________________________________________
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chats/:id", (req, res) => {
  const chat = chats.find((chat) => chat._id === req.params.id);
  res.send(chat);
});


app.use(notFound);
app.use(errorMiddleware);
   
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgWhite.black);
});
  