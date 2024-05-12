import express from "express";
import { loginUser, newUser ,logout, knowStatus,getAllUsers} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", newUser);
router.post("/login", loginUser);

router.use(isAuthenticated);

router.get("/users",getAllUsers);
router.get("/logout",logout);
router.post("/status",knowStatus);

export default router;
  