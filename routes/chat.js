import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { accessChat, fetchChats } from "../controllers/chat.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", accessChat);
router.get("/", fetchChats);

export default router;
