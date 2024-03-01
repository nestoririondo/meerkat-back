import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
