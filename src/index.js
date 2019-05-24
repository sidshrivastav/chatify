const path = require('path')
const http = require('http')
const express = require('express')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

io.on('connection', (socket) => {
    console.log("New Connection!!")
    socket.on('newUser', () => {
        socket.emit('message', generateMessage('Welcome!'))
        socket.broadcast.emit('message', generateMessage('A new user joined!!'))
    })
    socket.on('sendMsg', (message, callback) => {
        io.emit('message', generateMessage(message))
        callback()
    })
    socket.on('sendLocation', (message, callback) => {
        socket.broadcast.emit('locationMessage', generateMessage(`https://google.com/maps?q=${message.latitude},${message.longitude}`))
        callback()
    })
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A new user left!!'))
    })  
})

server.listen(3000, () => {
    console.log('Server is up on port 3000.')
})