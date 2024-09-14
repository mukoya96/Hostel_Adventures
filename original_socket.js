// server.js
const express = require('express');
const http = require('http');
const app = express();
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors())


let users = [];


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
  
    socket.on('send_message',(data)=>{
        socket.broadcast.emit('rec',data)
    })
  });


  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });