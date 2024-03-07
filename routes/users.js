import express from "express";
import {
  createUser,
  inviteUser,
  completeRegistration,
  decryptToken,
  getUser,
  getUsers,
  updateUser,
  loginUser,
  addContact,
  removeContact,
  getUserNames
} from "../controllers/users.js";
import { authenticate, updateLastLogin } from "../middlewares/authenticate.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/invite/:id", authenticate, inviteUser); // invite user to event id
userRouter.post("/login", loginUser);
userRouter.post("/decrypt-token", decryptToken)
userRouter.put('/complete-registration/:id', completeRegistration);
userRouter.get("/user", authenticate, getUser, updateLastLogin);
userRouter.get("/all", authenticate, getUsers);
userRouter.get("/names", getUserNames);

userRouter.put("/:id", authenticate, updateUser);
userRouter.put("/:id/contacts/add", authenticate, addContact);
userRouter.put("/:id/contacts/remove", authenticate, removeContact);
// userRouter.delete("/:id", deleteUser);

export default userRouter;
