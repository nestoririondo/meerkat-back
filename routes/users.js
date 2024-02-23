import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
} from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";

const userRouter = express.Router();

userRouter.get("/:id", authenticate, getUser);
userRouter.get("/all", getUsers);
userRouter.post("/", createUser);
userRouter.put("/:id", updateUser);
// userRouter.delete("/:id", deleteUser);
userRouter.post("/login", loginUser);

export default userRouter;