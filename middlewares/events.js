import Event from "../models/Event.js";

export const checkEventExists = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    return !event
      ? res.status(404).json({ message: "Event not found." })
      : (req.event = event) && next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
