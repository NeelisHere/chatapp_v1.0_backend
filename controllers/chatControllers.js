
const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel.js')
const User = require('../models/userModel.js')
const {break_point}  = require('../config/debugger.js')


const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body
    if(!userId){
        console.log('userId-params is not sent with the request.')
        return res.sendStatus(400)
    }
    // console.log(req)
    let isChat = await Chat.find({
        isGroupChat: false,
        $and:[
            {users: {$elemMatch:{$eq: req.user._id}}},
            {users: {$elemMatch:{$eq: userId}}}
        ]
    }).populate('users', '-password').populate('latestMessage')

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select:'username pic email'
    })

    if(isChat.length > 0){
        res.send(isChat[0])
    }else{
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate('users', '-password')
            res.status(200).json(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
})

const getChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 })
            .then(async(results)=>{
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'username pic email'
                })
                res.status(200).send(results)
            })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    break_point(1)
    console.log(req.body)
    if(!req.body.users || !req.body.name){
        return res.status(400).send({ message: 'please fill all the details.' })
    }
    break_point(2)
    let users = JSON.parse(req.body.users)
    if(users.length < 2){
        return res.status(400).send('More than 2 users required to form a group-chat')
    } 
    users.push(req.user)
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.user
        })
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-passowrd')
        res.status(200).json(fullGroupChat)     

    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body
    const renamedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
    if(!renamedChat){
        res.status(400)
        throw new Error('Chat not found')
    }else{
        res.json(renamedChat)
    }

})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body
    const updatedGroupChatMembers = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

    if(!updatedGroupChatMembers){
        res.status(400)
        throw new Error('Chat not found')
    }else{
        res.json(updatedGroupChatMembers)
    }
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body
    const updatedGroupChatMembers = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')

    if(!updatedGroupChatMembers){
        res.status(400)
        throw new Error('Chat not found')
    }else{
        res.json(updatedGroupChatMembers)
    }

})


module.exports = { 
    accessChat, 
    getChats, 
    createGroupChat, 
    renameGroup, 
    removeFromGroup, 
    addToGroup 
}