// Burguer menu

const open = document.querySelector('.fa-bars')
const close = document.querySelector('.fa-xmark')
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
        close.style.display = 'var(--fa-display,inline-block)'
        menu.style.display = 'block'
    } else {
        close.style.display = 'none'
        open.style.display = 'var(--fa-display,inline-block)'
        menu.style.display = 'none'
    }
}

update()

// Cart quantity

let socket = io()

socket.on('quantity', cart => {
    document.querySelector('#cart').innerHTML = cart.products.length
})
