const asyncHandler = require('express-async-handler');
const Message = require('../Models/messages');
const User = require('../Models/user.js');
const Chat = require('../Models/chatModel');
const Notification = require('../Models/notification');
const getNotifications = asyncHandler(async (req, res) => {
     try {
        // console.log(req.params.chatId)
        var messages = await Notification.find({ notified: req.params.chatId })
            .populate('sender', 'name pic email')
             .populate('chat');
            
messages = await User.populate(messages, {
    path: 'chat.users',
    select: 'name pic email',
});
            console.log(messages)
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
    
}); 
const removeNotifications = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Notification.findByIdAndUpdate(chatId, {
        $pull: { notified: userId },
        
    },
        {
            new: true
        })
        .populate("notified", "-password");
    console.log(removed);
    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});
module.exports = { getNotifications,removeNotifications };