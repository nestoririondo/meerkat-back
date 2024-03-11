import Event from "../models/Event.js";

export const addExpenses = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { amount, title } = req.body;

  try {
    const event = await Event.findOneAndUpdate(
      { _id: id },
      { $push: { expenses: { user: userId, amount, title } } },
      { new: true }
    ).populate({
      path: "expenses.user",
      select: "name picture",
    });
    if (!event) return res.status(404).send("Event not found or unauthorized.");
    res.json(event.expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteExpenses = async (req, res) => {
  const { expenseId } = req.params;
  const userId = req.user.id;
  try {
    if (req.event.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    const expense = req.event.expenses.id(expenseId);
    if (!expense) {
      return res.status(404).json({ error: "Item not found." });
    }
    req.event.expenses.pull(expenseId);
    const updatedEvent = await req.event.save();
    const populatedEvent = await updatedEvent.populate({
      path: "expenses.user",
      select: "name picture",
    });
    return res.status(200).json(populatedEvent.expenses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
