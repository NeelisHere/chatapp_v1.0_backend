const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const schema = {
    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: 'https://icon-library.com/images/141782.svg.svg'
    },
}
const userSchema = mongoose.Schema(schema)

const User = mongoose.model('User', userSchema)

module.exports = User

