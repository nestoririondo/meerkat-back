import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
  updateContacts,
} from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";
import { getUserEvents } from "../controllers/events.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", authenticate, getUser, getUserEvents);
userRouter.get("/all", getUsers);
userRouter.put("/:id", updateUser);
userRouter.put("/contacts/:id", updateContacts);
// userRouter.delete("/:id", deleteUser);


export default userRouter;