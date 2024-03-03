import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ event: id }).populate({
      path: "sender",
      select: "name picture",
      populate: {
        path: "picture",
        select: "url",
      },
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postMessage = async (req, res) => {
  const { id } = req.params;
  const { id: sender } = req.user;
  try {
    const message = await Message.create({
      event: id,
      sender,
      message: req.body.message.message,
      readBy: [sender],
    });
    const messageWithSender = await message.populate({
      path: "sender",
      select: "name picture",
      populate: {
        path: "picture",
        select: "url",
      },
    });
    res.status(201).json(messageWithSender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUnreadMessagesNumber = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    const unreadMessages = await Message.find({
      event: id,
      readBy: { $ne: userId },
    });
    res.json({ unreadMessages: unreadMessages.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markMessagesAsRead = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  try {
    await Message.updateMany(
      { event: id, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
    res.json({ message: "Messages marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};