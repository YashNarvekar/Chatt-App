const express = require("express");
const {Server} = require("socket.io")
const http = require("http")
// var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"]
    }
})


app.get("/", (req,res) => {
    res.send("Socket Chat")
})

io.on("connection", (socket) =>{
    // console.log(socket.id);

    socket.on("joinRoom", room => socket.join(room));
    socket.on("NewMessage",({newMessage, room}) => {
        console.log(room, newMessage)
        io.in(room).emit("getLatestMessage", newMessage)


    }) 

})

server.listen(8000, () => console.log("App started at port 8000"))