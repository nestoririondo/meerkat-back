import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ event: id }).populate(
      "sender",
      "name picture"
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const postMessage = async (req, res) => {
  const { id } = req.params;
  const { id: sender } = req.user;
  console.log(req.body.message.message.text);
  try {
    const message = await Message.create({
      event: id,
      sender,
      message: req.body.message.message,
      readBy: [sender],
    });
    const messageWithSender = await message.populate("sender", "name picture");
    res.status(201).json(messageWithSender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
