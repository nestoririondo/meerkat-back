import Message from "../models/Message.js";
import cloudinary from "../db/cloudinary.js";

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
    let imageUrl = '';
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "messages",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        // The file's data is sent to Cloudinary. req.file.buffer will contain the file's data as a binary buffer, which is what you're uploading.
        //The .end() method on the upload stream is used to write this buffer to the stream, initiating the upload process.
        uploadStream.end(req.file.buffer);
      });
      // Once the promise resolves, the result object contains details about the uploaded file, including its URL on Cloudinary's servers. After the upload is successful, we store the image URL returned by Cloudinary
      imageUrl = result.url;
    }

    const message = await Message.create({
      event: id,
      sender,
      text: req.body.text,
      file: req.file ? imageUrl : null,
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
