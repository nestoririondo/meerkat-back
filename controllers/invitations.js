import Invitation from "../models/Invitation.js";
import Event from "../models/Event.js";

export const getEventInvitations = async (req, res) => {
  const { eventId } = req.params; // event id
  try {
    const invitations = await Invitation.find({ event: eventId });
    res.json(invitations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMyInvitations = async (req, res) => {
  const { id } = req.user; // user id
  try {
    const invitations = await Invitation.find({
      invited: id,
      status: "pending",
    })
      .populate({
        path: "inviting",
        select: "name picture",
        populate: {
          path: "picture",
          select: "url",
        },
      })
      .populate("event", "title date");

    res.json(invitations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInvitation = async (req, res) => {
  const { eventId } = req.params;
  const { invited } = req.body;
  const { id } = req.user;
  console.log(id, "inviting");
  try {
    const existingInvitation = await Invitation.findOne({
      type: "event",
      inviting: id,
      invited,
      status: "pending",
      event: eventId,
    });
    if (existingInvitation) {
      return res.status(400).json({ message: "Invitation already exists" });
    }

    const invitation = await Invitation.create({
      type: "event",
      inviting: id,
      invited,
      event: eventId,
    });
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFriendRequest = async (req, res) => {
  const { invited } = req.body;
  const { id } = req.user;
  try {
    const existingInvitation = await Invitation.findOne({
      type: "friendship",
      inviting: id,
      invited,
      status: "pending",
    });
    if (existingInvitation) {
      return res.status(400).json({ message: "Friend request already exists" });
    }
    const invitation = await Invitation.create({
      type: "friendship",
      inviting: id,
      invited,
    });
    res.status(201).json(invitation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const { status } = req.body;
  const { id } = req.user;
  try {
    const invitation = await Invitation.findByIdAndUpdate(
      invitationId,
      { status },
      {
        new: true,
      }
    );
    if (invitation.inviting === id || invitation.invited === id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (invitation.type === "event") {
      if (invitation.status === "accepted") {
        await Event.findByIdAndUpdate(invitation.event, {
          $addToSet: { participants: invitation.invited },
        });
      } else if (invitation.status === "rejected") {
        await Event.findByIdAndUpdate(invitation.event, {
          $pull: { participants: invitation.invited },
        });
      
      }
    }
    res.json(invitation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
