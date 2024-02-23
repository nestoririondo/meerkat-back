import express from "express";
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  loginUser,
  updateContacts,
  updateEvents,
} from "../controllers/users.js";
import { authenticate } from "../middlewares/authenticate.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/user", authenticate, getUser);
userRouter.get("/all", getUsers);
userRouter.put("/:id", updateUser);
userRouter.put("/contacts/:id", updateContacts);
userRouter.put("/events/:id", updateEvents);
// userRouter.delete("/:id", deleteUser);


export default userRouter;