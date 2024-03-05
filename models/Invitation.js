import mongoose from "mongoose";

const InvitationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  inviting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  invited: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: { type: String, default: "pending"}, // pending, accepted, declined
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});
const Invitation = mongoose.model("Invitation", InvitationSchema);

export default Invitation;
