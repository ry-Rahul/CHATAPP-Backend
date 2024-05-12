import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { allMessages, sendMessage } from "../controllers/message.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/",sendMessage);
router.get("/:chatId",allMessages);

export default router;
  