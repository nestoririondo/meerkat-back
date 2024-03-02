import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  title: { type: String, required: true },
  description: { type: String },
  location: {
    description: { type: String, required: true },
    lat: { type: Number },
    long: { type: Number },
  },
  date: {
    start: { type: Date, required: true },
    end: { type: Date },
  },
  picture: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  created: { type: Date, default: Date.now },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  todos: [
    {
      assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      done: { type: Boolean, default: false },
      title: { type: String, required: true },
    },
  ],
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
