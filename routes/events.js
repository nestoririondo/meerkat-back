import express from 'express';
import { createEvent, getEvent, updateEvent, updateParticipants } from '../controllers/events.js';
import { addAndAssignTodo, checkUncheckTodo, editTodo, deleteTodo } from '../controllers/todos.js';
import { authenticate } from '../middlewares/authenticate.js';

const eventRouter = express.Router();

eventRouter.post('/', createEvent);
eventRouter.get('/:id', authenticate, getEvent);
eventRouter.put('/:id', authenticate, updateEvent);
eventRouter.put('/:id/participants', authenticate, updateParticipants);
// eventRouter.delete('/:id', deleteEvent);

eventRouter.post('/:id/todos/add', authenticate, addAndAssignTodo);
eventRouter.put('/:id/todos/:todoId/toggle', authenticate, checkUncheckTodo);
eventRouter.put('/:id/todos/:todoId/edit', authenticate, editTodo);
eventRouter.delete('/:id/todos/:todoId', authenticate, deleteTodo);

export default eventRouter;
