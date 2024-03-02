export const addAndAssignTodo = async (req, res) => {
  const { title, description, assignee } = req.body;
  const userId = req.user.id;
  try {
    if (req.event.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    const todo = { title, description, assignee: assignee || null };
    req.event.todos.push(todo);
    const updatedEvent = await req.event.save();

    return res.status(201).json(updatedEvent.todos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const checkUncheckTodo = async (req, res) => {
  const { todoId } = req.params;
  const userId = req.user.id;
  try {
    if (
      req.event.owner.toString() !== userId &&
      req.event.todos.id(todoId).assignee?.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    const todo = req.event.todos.id(todoId);
    todo.done = !todo.done;
    const updatedEvent = await req.event.save();

    return res.status(200).json(updatedEvent.todos);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const editTodo = async (req, res) => {
  const { todoId } = req.params;
  const { title, assignee } = req.body;
  const userId = req.user.id;
  try {
    if (req.event.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    const todo = req.event.todos.id(todoId);
    if (title !== undefined) todo.title = title;
    if (assignee !== undefined)
      todo.assignee = assignee === "" ? null : assignee;
    const updatedEvent = await req.event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const userId = req.user.id;
  try {
    if (req.event.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    const todo = req.event.todos.id(todoId);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found." });
    }
    req.event.todos.pull(todoId);
    const updatedEvent = await req.event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
