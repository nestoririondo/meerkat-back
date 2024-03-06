import Invitation from "../models/Invitation.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

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

export const getMyFriendRequests = async (req, res) => {
  const { id } = req.user;
  try {
    const invitations = await Invitation.find({
      $or: [{ inviting: id }, { invited: id }],
      type: "friendship",
      status: "pending",
    }).populate({
      path: "invited inviting",
      select: "name picture",
      populate: {
        path: "picture",
        select: "url",
      },
    });

    res.json(invitations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createInvitation = async (req, res) => {
  const { invited } = req.body;
  const { id } = req.user;
  const { eventId } = req.params;
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
    let invitation = await Invitation.create({
      type: "friendship",
      inviting: id,
      invited,
    });
    invitation = await invitation.populate({
      path: "inviting invited",
      select: "name picture",
      populate: {
        path: "picture",
        select: "url",
      },
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
    ).populate({
      path: "inviting invited",
      select: "name picture",
      populate: {
        path: "picture",
        select: "url",
      },
    });
    if (invitation.inviting._id === id || invitation.invited._id === id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (invitation.type === "event" && invitation.status === "accepted") {
      await Event.findByIdAndUpdate(invitation.event, {
        $addToSet: { participants: invitation.invited._id },
      });
    } else if (invitation.status === "rejected") {
      await Event.findByIdAndDelete(invitation);
    }

    if (invitation.type === "friendship" && invitation.status === "accepted") {
      await User.findByIdAndUpdate(invitation.inviting._id, {
        $addToSet: { contacts: invitation.invited._id },
      });
      await User.findByIdAndUpdate(invitation.invited._id, {
        $addToSet: { contacts: invitation.inviting._id },
      });
    } else if (invitation.status === "rejected") {
      await User.findByIdAndDelete(invitation);
    }

    res.json(invitation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteInvitation = async (req, res) => {
  const { invitationId } = req.params;
  const { id } = req.user;
  try {
    const invitation = await Invitation.findById(invitationId);
    if (invitation.inviting === id || invitation.invited === id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Invitation.findByIdAndDelete(invitationId);
    res.json({ message: "Invitation deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
