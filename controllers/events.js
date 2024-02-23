import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserEvents = async (req, res) => {
  const userId = req.user.id;
  try {
    const events = await Event.find({
      $or: [{ owner: userId }, { participants: userId }],
    });
    const userAndEvents = { user: req.user, events: events };
    return !events
      ? res.status(404).json({ message: "No events found" })
      : res.json(userAndEvents);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (event.owner.toString() !== userId && !event.participants.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized." });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    if (event.owner.toString() !== userId) {
      return res.status(403).json({ message: "User not authorized to edit this event." });
    }
    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateParticipants = async (req, res) => {
  const { id } = req.params;
  const { newParticipants } = req.body;
  const userId = req.user.id;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }
    if (event.owner.toString() !== userId) {
      return res.status(403).json({ error: "User not authorized to edit this event." });
    }
    event.participants = newParticipants;
    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
