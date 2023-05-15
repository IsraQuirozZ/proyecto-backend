import server from "./app.js";
import { Server } from "socket.io";

const PORT = 8080;
const ready = () => console.log("server ready on port " + PORT);

let http_server = server.listen(PORT, ready);
let socket_server = new Server(http_server)

socket_server.on(
    'connection',
    socket => {
        console.log(`client ${socket.client.id} connected`)
        socket.emit('quantity', async () => {
            try {
                let res = await fetch('/api/carts')
                let data = res.json()
                return data
            } catch (error) {
                return error
            }
        }
        )
    }
)