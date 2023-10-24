const asyncHandler = require('express-async-handler');
const Message = require('../Models/messages');
const User = require('../Models/user.js');
const Chat = require('../Models/chatModel');
const sendMessages = asyncHandler(async (req,res) => {
    console.log(req.body);
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log('Invalid data passed into request');
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chatId: chatId,
    };

    try {
        var message = await Message.create(newMessage);
        message = await message.populate('sender', 'name pic');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email',
        });
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
            
        });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});
const allMessages = asyncHandler(async(req,res) => {
    try {
        console.log(req.params.chatId)
        const messages = await Message.find({ _id: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
            console.log(messages)
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
module.exports = { sendMessages,allMessages };