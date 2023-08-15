const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
    {
        timestamps: true,
        versionKey:false
    }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;