const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const handleError = require('../config/error.js')
const generateToken = require('../config/generateToken.js')
const bcrypt = require('bcrypt')

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).select('+password')
    const isMatch = await bcrypt.compare(password, user.password)
    if(user && isMatch){
        res.json({
            success: true,
            user,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error('Invalid username or password.')
    }
})

const register = asyncHandler(async (req, res) => {
    const { username, email, password, confirmedPassword, pfp } = req.body

    if(!username || !email || !password || !confirmedPassword){
        handleError(res, 'Please enter all the fields.', 400)
    }

    if(password !== confirmedPassword){
        handleError(res, 'Passwords did not match.', 400)
    }

    const userExists = await User.findOne({ username })
    if(userExists){
        handleError(res, 'User already exists', 400)
    }

    const hash = await bcrypt.hash(password, 10)
    const {_doc: user} = await User.create({ username, email, password: hash, pfp })

    if(user){
        res.status(201).json({
            success:true,
            user: {...user, token: generateToken(user._id)}
        })
    }else{
        handleError(res, 'Failed to create user.', 400)
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or:[
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    }:{}
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })
    res.json({
        success: true,
        users
    })
})

module.exports={ login, register, getAllUsers }