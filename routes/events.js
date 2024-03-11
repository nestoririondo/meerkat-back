import express from "express";
import {
  createEvent,
  getEvent,
  getUserEvents,
  updateEvent,
  updateParticipants,
  addParticipant,
  removeParticipant,
  leaveEvent,
  deleteEvent,
} from "../controllers/events.js";
import {
  addAndAssignTodo,
  checkUncheckTodo,
  editTodo,
  deleteTodo,
} from "../controllers/todos.js";
import { authenticate } from "../middlewares/authenticate.js";
import { checkEventExists } from "../middlewares/events.js";
import { addExpenses, deleteExpenses } from "../controllers/expenses.js";

const eventRouter = express.Router();

eventRouter.post("/", createEvent);
eventRouter.get("/", authenticate, getUserEvents);
eventRouter.get("/:id", authenticate, getEvent);
eventRouter.put("/:id", authenticate, updateEvent);
eventRouter.put("/:id/participants", authenticate, updateParticipants);
eventRouter.put("/:id/participants/add", authenticate, addParticipant);
eventRouter.put("/:id/participants/remove", authenticate, removeParticipant);
eventRouter.put("/:id/participants/leave", authenticate, leaveEvent);
eventRouter.delete("/:id", authenticate, deleteEvent);

eventRouter.post(
  "/:id/todos/add",
  authenticate,
  checkEventExists,
  addAndAssignTodo
);
eventRouter.put(
  "/:id/todos/:todoId/toggle",
  authenticate,
  checkEventExists,
  checkUncheckTodo
);
eventRouter.put(
  "/:id/todos/:todoId/edit",
  authenticate,
  checkEventExists,
  editTodo
);
eventRouter.delete(
  "/:id/todos/:todoId",
  authenticate,
  checkEventExists,
  deleteTodo
);

eventRouter.put("/:id/expenses/", authenticate, checkEventExists, addExpenses);
eventRouter.delete(
  "/:id/expenses/:expenseId",
  authenticate,
  checkEventExists,
  deleteExpenses
);

export default eventRouter;
