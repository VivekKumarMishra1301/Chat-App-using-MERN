const mongoose = require('mongoose');



// const mongoose=require('mongoose');
const notificationModel = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    notified: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ]
},
    {
        timestamps: true,
    }
);



const Notification = mongoose.model("Notification", notificationModel);
module.exports = Notification;