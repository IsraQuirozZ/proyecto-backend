let socket = io()

let quantity = 0

socket.on('quantity', data => {
    console.log(data)
})