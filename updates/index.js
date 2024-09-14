// server.js
const express = require('express');
const http = require('http');
const app = express();
const {Server} = require('socket.io');
const cors = require('cors');

app.use(cors())


let user_names = [];


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    socket.on('joinRoom', (room) => {
      socket.join(room);
    
    }); // join room

    
    // Send a message to a specific room
    socket.on('sendMessage', (data) => {
      const { room, word } = data;
      io.to(room).emit('receiveMessage', {word});
      console.log(`Message sent to room ${room}: ${word}`);
    }); 
    

    socket.on('send_name', (your_name, room) => {


      user_names.push({ id: socket.id, your_name, room }); // push new names into array

      console.log(user_names)

      io.emit('updateUsers', user_names); // Notify all clients of the new user list
      
      

    });
  
    socket.on('send_message',(data)=>{
        socket.broadcast.emit('rec',data)
    })
  });


  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });