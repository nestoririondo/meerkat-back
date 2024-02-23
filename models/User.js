import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String, default: "1" },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;

// export const addParticipant = async (req, res) => {
//     const { eventId, userId } = req.params;
  
//     try {
//       const event = await Event.findById(eventId);
//       const user = await User.findById(userId);
  
//       if (!event || !user) {
//         return res.status(404).json({ error: "Event or user not found" });
//       }
  
//       // Add the event to the user's events and the user to the event's participants
//       user.events.addToSet(eventId);
//       event.participants.addToSet(userId);
  
//       await user.save();
//       await event.save();
  
//       return res.status(200).json({ event, user });
//     } catch (error) {
//       return res.status(500).json({ error: error.message });
//     }
//   };