import Event from "../models/Event.js";
import Message from "../models/Message.js";
import Invitation from "../models/Invitation.js";

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
    })
      .populate({
        path: "participants owner",
        select: "name picture",
        populate: {
          path: "picture",
          select: "url",
        },
      })
      .populate({
        path: "picture",
        select: "url",
      }).sort({ date: 1 });

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
    const event = await Event.findById(id)
      .populate({
        path: "participants owner",
        select: "name picture",
        populate: {
          path: "picture",
          select: "url",
        },
      })
      .populate({
        path: "picture",
        select: "url",
      });
    console.log(event);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (
      event.owner._id.toString() !== userId &&
      !event.participants.map((p) => p._id.toString()).includes(userId)
    ) {
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
  const { data } = req.body;
  try {
    let updatedEvent = await Event.findOneAndUpdate(
      { _id: id, owner: userId },
      { ...data },
      { new: true }
    );

    console.log({ data }, "data");

    if (!updatedEvent) {
      return res.status(403).json({
        message: "User not authorized to edit this event or event not found.",
      });
    }

    const updatedData = {};
    for (const key in data) {
      updatedData[key] = updatedEvent[key];
    }
    return res.status(200).json(updatedData);
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
      return res
        .status(403)
        .json({ error: "User not authorized to edit this event." });
    }
    event.participants = newParticipants;
    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const addParticipant = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const newParticipantId = req.body.participant;
  if (!newParticipantId)
    return res.status(400).send("Participant id required.");
  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, owner: userId, participants: { $ne: newParticipantId } },
      { $push: { participants: newParticipantId } },
      {
        new: true,
        populate: {
          path: "participants",
          select: "name picture",
          populate: { path: "picture", select: "url" },
        },
      }
    );
    if (!event)
      return res
        .status(404)
        .send("Event not found or unauthorized or participant already added.");

    res.json(event.participants);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const removeParticipant = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const oldParticipantId = req.body.participant;
  if (!oldParticipantId)
    return res.status(400).send("Participant id required.");
  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, owner: userId },
      { $pull: { participants: oldParticipantId } },
      {
        new: true,
        populate: {
          path: "participants",
          select: "name picture",
          populate: { path: "picture", select: "url" },
        },
      }
    );
    res.json(event.participants);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const leaveEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  console.log(userId, "LEAVING");
  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, participants: userId },
      { $pull: { participants: userId } },
      {
        new: true,
      }
    );
    if (!event) return res.status(404).send("Event not found or unauthorized.");
    res.json(event.participants);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const event = await Event.findOne({ _id: id, owner: userId });
    if (!event) return res.status(404).send("Event not found or unauthorized.");
    await Event.deleteOne({ _id: id });
    // delete invitations
    const invitations = await Invitation.find({ event: id });
    if (invitations) {
      await Invitation.deleteMany({ event: id });
    }
    // delete messages
    const messages = await Message.find({ event: id });
    if (messages) {
      await Message.deleteMany({ event: id });
    }
    res.json({
      message: "Event, invitations to event and messages from event deleted.",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
