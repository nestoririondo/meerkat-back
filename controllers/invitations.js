import Invitation from "../models/Invitation.js";

export const getEventInvitations = async (req, res) => {
  const { eventId } = req.params; // event id
  try {
    const invitations = await Invitation.find({ event: eventId });
    res.json(invitations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  const { id } = req.user; // user id
  console.log(req.user);
  try {
    const invitations = await Invitation.find({
      type: "friendship",
      invited: id,
      status: "pending",
    });
    res.json(invitations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInvitation = async (req, res) => {
  const { type, invited, event } = req.body;
  const { id } = req.user;
  console.log(id, "inviting");
  try {
    const existingInvitation = await Invitation.findOne({
      type,
      inviting: id,
      invited,
      status: "pending",
      event,
    });
    if (existingInvitation) {
      return res.status(400).json({ message: "Invitation already exists" });
    }

    const invitation = await Invitation.create({
      type,
      inviting: id,
      invited,
      event,
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
    res.json(invitation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
