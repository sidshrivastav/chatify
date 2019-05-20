const socket = io()
socket.emit('newUser')

const sendMsgForm = document.querySelector('#send-message-form')
const msgToSend = document.querySelector('#message-to-send')
const sendLocation = document.querySelector('#send-location')
const messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML

sendMsgForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMsgForm.querySelector('button').setAttribute('disabled', 'disabled')
    socket.emit('sendMsg', msgToSend.value, () => {
        sendMsgForm.querySelector('button').removeAttribute('disabled')
        sendMsgForm.querySelector('input').value = ''
        sendMsgForm.querySelector('input').focus()
        console.log("The message was delieverd!")
    })
})

sendLocation.addEventListener('click', (e) => {
    e.preventDefault()
    sendLocation.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation',{
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude,
        }, () => {
            sendLocation.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        message
    })
    messages.insertAdjacentHTML('beforeend', html)
})

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    messages.insertAdjacentHTML('beforeend', html)
})