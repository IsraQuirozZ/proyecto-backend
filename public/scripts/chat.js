const socket = io()

const send = e => {
    if (e.key === 'Enter'){
        console.log(chatBox.value)
    }
}

const chatBox = document.querySelector('#chatBox')
chatBox.addEventListener('keyup', send)