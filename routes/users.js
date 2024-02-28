import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
  addContact,
  removeContact,
} from "../controllers/users.js";
import { authenticate, updateLastLogin } from "../middlewares/authenticate.js";
import { getUserEvents } from "../controllers/events.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", authenticate, getUser, updateLastLogin, getUserEvents);
userRouter.get("/all", getUsers);
userRouter.put("/:id", authenticate, updateUser);
userRouter.put("/:id/contacts/add", authenticate, addContact);
userRouter.put("/:id/contacts/remove", authenticate, removeContact);
// userRouter.delete("/:id", deleteUser);

export default userRouter;
