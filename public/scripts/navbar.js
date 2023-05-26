// Burguer menu

const open = document.querySelector('#open')
const close = document.querySelector('#close')
const menu = document.querySelector('nav')

let opened = false

open.addEventListener('click', () => {
    opened = true
    update()
})

close.addEventListener('click', () => {
    opened = false
    update()
})

const update = () => {
    if (opened) {
        open.style.display = 'none'
        close.style.display = 'block'
        menu.style.display = 'block'
    } else {
        close.style.display = 'none'
        open.style.display = 'block'
        menu.style.display = 'none'
    }
}

update()

// Cart quantity

let socket = io()

socket.on('quantity', quantity => {
    document.querySelector('#cart').innerHTML = quantity
})
