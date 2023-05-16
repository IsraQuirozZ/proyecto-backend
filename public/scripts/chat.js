let userName;

Swal.fire({
    title: 'Write your name',
    input: 'text',
    inputValidator: value => !value && 'Please, write your name',
    allowOutsideClick: false,
    allowEscapeKey: false
}).then(res => {
    userName = res.value
    document.querySelector('#userName').innerHTML = userName
    socket.emit('auth', userName)
})

const send = e => {
    if (e.key === 'Enter'){
        socket.emit('new_message', {
            userName,
            message: chatBox.value
        })
        chatBox.value = ''
    }
}

const chatBox = document.querySelector('#chatBox')
chatBox.addEventListener('keyup', send)

socket.on('all_messages', data => {
    document.querySelector('#messages').innerHTML = data.map(msg => `<h6>${msg.userName}</h6><p>${msg.message}</p>`).join('')
})