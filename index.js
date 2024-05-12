import express from "express";
import userRouter from "./routes/user.js";
import chatRouter from "./routes/chat.js";
import messageRouter from "./routes/message.js";
import { connectDb } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware, notFound } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";


dotenv.config({ path: "./.env" });

const app = express();
// ______socket.io_____________________________________________________
const server = createServer(app);


const io = new Server(server, { 
   pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000", 
    }, 

});  

const PORT = process.env.PORT || 3000;  
const mongoUri = process.env.MONGO_URI;
 
connectDb(mongoUri);  

// middlewar e
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);



// routes__________________________________________________________
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});


// ______socket.io_____________________________________________________
io.on("connection", (socket) => {


  console.log("connected  to socket io ");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("joined room", room);
  } );

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});


app.use(notFound);
app.use(errorMiddleware);
   
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.bgWhite.black);
});
  