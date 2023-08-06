const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db')
const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require('./routes/chatRoutes.js')
const messageRoutes = require('./routes/messageRoutes.js')
// const colors = require('colors')

const app = express();
dotenv.config()
connectDB()

app.use(cors())
app.use(express.json());
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/chats', chatRoutes)
app.use('/api/v1/messages', messageRoutes)

const PORT= process.env.PORT || 8000



app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Home-route working'
    })
})


const server = app.listen(PORT, ()=>{
    console.log(`listening on: http://localhost:${PORT}`)
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log('connected to socket.io')
    socket.on('setup', (userData) => {
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('connected')
    })
    socket.on('join chat', (room)=> {
        socket.join(room)
        console.log('User joined Room: ', room)
    })
    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))
    socket.on('new message', (newMessageReceived) => {
        let chat = newMessageReceived.chat
        if(!chat.users)return console.log('chat.users not defined')
        chat.users.forEach((user) => {
            if(user._id === newMessageReceived.sender._id)return;
            // console.log(newMessageReceived)
            socket.in(user._id).emit('message received', newMessageReceived)
        });
    })
    socket.off('setup', () => {
        console.log('USER DISCONNECTED')
        socket.leave(userData._id)
    })
})

//npaulbe19
//h1TZhvYKBybNi7GS