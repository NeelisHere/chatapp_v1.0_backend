const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel.js');
const User = require('../models/userModel.js');
const Chat = require('../models/chatModel.js');

module.exports = {
    sendMessage: asyncHandler(async(req, res) => {
        const { content, chatId } = req.body
        if(!content || !chatId){
            console.log('invalid data');
            return res.sendStatus(400)
        }
        let newMessage = {
            sender: req.user._id,
            content,
            chat: chatId
        }
        try {
            let message = await Message.create(newMessage)
            message = await message.populate('sender', 'username pic')
            message = await message.populate('chat')
            message = await User.populate(message, {
                path: 'chat.users',
                select: 'username pic email'
            })
            await Chat.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message
            })
            res.json(message)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }),
    allMessages: asyncHandler(async(req, res) => {
        try {
            const messages = await Message.find({ chat: req.params.chatId })
                .populate('sender', 'username pic email')
                .populate('chat')
            res.json(messages)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    })
}