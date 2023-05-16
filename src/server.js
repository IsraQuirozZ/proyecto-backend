import server from "./app.js";
import { Server } from "socket.io";
import cartManager from "./managers/Cart.js";

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);

let http_server = server.listen(PORT, ready);
let socket_server = new Server(http_server)
const chats = []
const cart = await cartManager.getCartById(1)

socket_server.on(
    'connection',
    socket => {
        
        // //  console.log(`client ${socket.client.id} connected`)

        // Chat


        socket.on('auth', () => {
            socket_server.emit('all_messages', chats)
        })

        socket.on('new_message', data => {
            chats.push(data)
            socket_server.emit('all_messages', chats)
        })

        // Carrito

        socket.emit('quantity', cart)
    }
)