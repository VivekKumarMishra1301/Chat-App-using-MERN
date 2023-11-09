const asyncHandler = require('express-async-handler');
const Message = require('../Models/messages');
const User = require('../Models/user.js');
const Chat = require('../Models/chatModel');
const Notification = require('../Models/notification');
const sendMessages = asyncHandler(async (req,res) => {
    // console.log('shi location');
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pic');
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
            
        });
        // var allUsers = await Chat.findOne({ _id: req.body.chatId }).populate('users');
        const allUsers = await Chat.findById(req.body.chatId)
        .select('users')
        .populate({
            path: 'users',
            select: '_id name email'
        });
        const val = allUsers.users.includes(req.user._id);
        console.log(val);
        var newNotification = {
            sender: req.user._id,
            content: content,
            chat: chatId,
            notified:allUsers.users
        }

        var notification = await Notification.create(newNotification);
        notification = await notification.populate('sender', 'name pic');
        notification = await notification.populate('chat');
        notification = await notification.populate('notified');
        notification = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });


    //     const removed = await Notification.findByIdAndUpdate(chatId, {
    //     $pull: { users: req.user._id },
        
    // },
    //     {
    //         new: true
    //     })
    //     .populate("users", "-password")
    //     .populate('groupAdmin', "-password");

    //     console.log(removed);
        console.log(notification);
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const allMessages = asyncHandler(async(req,res) => {
    try {
        // console.log(req.params.chatId)
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
            // console.log(messages)
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
module.exports = { sendMessages,allMessages };