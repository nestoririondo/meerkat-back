import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    event: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    message: {
        text: {type: String, required: true, default: ""},
        file: {type: String}
    },
    created: {type: Date, default: Date.now},
    readBy: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
}) 
const Message = mongoose.model("Message", MessageSchema)

export default Message;