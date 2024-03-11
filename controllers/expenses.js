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
    )
    .populate({
        path: 'expenses.user',
        select: 'name picture' // replace with the fields you want to include
      });
    if (!event) return res.status(404).send("Event not found or unauthorized.");
    res.json(event.expenses);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
