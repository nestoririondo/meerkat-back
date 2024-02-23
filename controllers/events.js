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
    console.log(userId, "picking up events")
    try {
        const events = await Event.find({
            $or: [{ owner: userId }, { participants: userId }]
        });
        return !events
            ? res.status(404).json({ message: "No events found" })
            : res.json(events);
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
    if (event.owner !== userId && !event.participants.includes(userId)) {
      return res.status(403).json({ message: "Unauthorized." });
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  //   const userId = req.user.id; we need to check if the user is the owner of the event
  try {
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
