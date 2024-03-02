import Image from "../models/Image.js";

export const getProfileImages = async (req, res) => {
  try {
    const images = await Image.find({ type: "profile" });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventImages = async (req, res) => {
  try {
    const images = await Image.find({ type: "background" });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

