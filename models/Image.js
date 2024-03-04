import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  type: { type: String, required: true },
  url: { type: String, required: true },
  created: { type: Date, default: Date.now },
});
const Image = mongoose.model("Image", ImageSchema);

export default Image;