import express from "express";
import userRouter from "./routes/user.js";
import connectDb from "./utils/features.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;

connectDb(mongoUri); 

// middleware
app.use(express.json());
app.use(express.urlencoded( {extended: true}))

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
