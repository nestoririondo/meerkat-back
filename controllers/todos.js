import Event from "../models/Event.js";

export const addAndAssignTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, assignee } = req.body;
    const userId = req.user.id;
    try {
      const event = await Event.findById(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      if (event.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ error: "User not authorized to edit this event." });
      }
      const todo = { title, description, assignee: assignee || null };
      event.todos.push(todo);
      const updatedEvent = await event.save();
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  export const checkUncheckTodo = async (req, res) => {
    const { id, todoId } = req.params;
    const userId = req.user.id;
    try {
      const event = await Event.findById(id);
      console.log(event.owner.toString(), "owner")
      console.log(userId, "userId")
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      if (event.owner.toString() !== userId && event.todos.id(todoId).assignee?.toString() !== userId) {
        console.log(event.owner)
        return res
          .status(403)
          .json({ error: "User not authorized to edit this event." });
      }
      const todo = event.todos.id(todoId);
      todo.done = !todo.done;
      const updatedEvent = await event.save();
      return res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  export const editTodo = async (req, res) => {
    const { id, todoId } = req.params;
    const { title, assignee } = req.body;
    const userId = req.user.id;
    try {
      const event = await Event.findById(id)
      if (!event) {
        return res.status(404).json({ error: "Event not found." });
      }
      if (event.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ error: "User not authorized to edit this event." });
      }
      const todo = event.todos.id(todoId);
      todo.title = title;
      todo.assignee = assignee;
      const updatedEvent = await event.save();
      return res.status(200).json(updatedEvent);
    }
    catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

export const deleteTodo = async (req, res) => {
    const { id, todoId } = req.params;
    const userId = req.user.id;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ error: "Event not found." });
        }
        if (event.owner.toString() !== userId) {
            return res.status(403).json({ error: "User not authorized to edit this event." });
        }
        const todo = event.todos.id(todoId);
        if (!todo) {
            return res.status(404).json({ error: "Todo not found." });
        }
        event.todos.pull(todoId);
        const updatedEvent = await event.save();
        return res.status(200).json(updatedEvent);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};