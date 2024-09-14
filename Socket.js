// server.js
const express = require('express');
const http = require('http');
const app = express();
const {Server} = require('socket.io');
const cors = require('cors');
const send = require('./Sendphp')


app.use(cors())


let user_names = [];
let Rooms = [];

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

      console.log(`joined room ${room}`)
    
    }); // join room

    

    socket.on('push_room', (data) => {

   
      
      const { id, room, yourname, player_num } = data

      let existingRoom = Rooms.find(r => r.room === room);

      if (existingRoom) {
        // Room exists, increment player_num
        existingRoom.player_num += 1;
    } else {
        // Room doesn't exist, create it
        Rooms.push({ id: socket.id, room, yourname, player_num}); // push new rooms into Rooms array
    }

      

      console.log(Rooms)

    

      io.emit('emit_rooms', {Rooms}); // Notify all clients of the new user lists
   
      

    });

    socket.on('new_view', (data) => {

   
      
      io.emit('emit_rooms', {Rooms}); // Notify all clients of the new user list
   
      

    });




   


    socket.on('send_name', (data) => {
      
      const { yourname, card_num, room } = data

      user_names.push({ id: socket.id, yourname, card_num, room}); // push new names into arrayss

      console.log(user_names)

      user_names[socket.id] = yourname;

      console.log(`${yourname} has connected with socket ID ${socket.id}`);

      io.to(room).emit('updateUsers', user_names); // Notify all clients of the new user lists
      
      

    });// join names

    socket.on('send_card', (data) => {


      const { room, yourname, className } = data
      console.log(`card info ${room}: ${yourname}: ${className}`);
     

      io.to(room).emit('send_card_data', data); // Notify all clients of the new user lists

    });// recieves and sends card info


        // Handle updating card population
     socket.on('updatePoints', ({ yourname, the_num, room }) => {
    const user = user_names.find(user => user.yourname === yourname);
    if (user) {
      user.card_num = the_num;
      io.to(room).emit('updateUsers', user_names); // Notify all clients about the updated pointss
      console.log(user_names)
    }
  });


          // Handle updating card population from deathcard
          socket.on('add_to_users', ({ user_victim, the_num_add, yourname, room }) => {
            const user_v = user_names.find(user_v => user_v.yourname === user_victim);
            if (user_v) {
              user_v.card_num = the_num_add
              const new_CN = parseInt(user_v.card_num)+the_num_add
              io.to(room).emit('updateUsers', user_names); // Notify all clients about the updated points
              io.to(room).emit('send_death_card', { user_victim, the_num_add, yourname }); // Notify all clients about the updated pointss
             
              
            }

            else
            {
              console.log('no')
            }

           
            
          });

            // Handle victory
            socket.on('victory', ({ yourname, className,room }) => {

              io.to(room).emit('send_victory', { yourname, className }); // Notify all clients about the updated points
         
            });

            socket.on('send_next', (data) => {
              const { f_name } = data;
              io.emit('recieve_next', { f_name}); 
            
              console.log(`f_name: ${f_name}`);
            }); 


            
            socket.on('sender', (data) => {
              const { yourname, room } = data;
           
              io.to(room).emit('rec_sender', { yourname}); 
            
       
            }); 
          

             // Send a message to a specific room
    socket.on('game_chat', (data) => {

      const {yourname, message, room} = data

  
      io.to(room).emit('send_game_chat', { yourname, message });
     
    }); 

    
    // Send a message to a specific room
    socket.on('sendMessage', (data) => {
      const { room, word } = data;
      io.to(room).emit('receiveMessage', {word});
      console.log(`Message sent to room ${room}: ${word}`);
    }); 

    socket.on('disconnect', () => {
      // Find the user who disconnected based on socket.id
      const disconnectedUser = user_names.find(user => user.id === socket.id);
    
      if (disconnectedUser) {
        const { yourname, room } = disconnectedUser;
        console.log(`${yourname} (socket ID: ${socket.id}) has disconnected from room ${room}`);
        
        // Remove the user from the user_names array
        user_names = user_names.filter(user => user.id !== socket.id);
    
        // Update the player_num in the Rooms array
        const roomData = Rooms.find(r => r.room === room);
        if (roomData) {
          roomData.player_num -= 1; // Decrease the player count by 1
          console.log(`Room ${room} now has ${roomData.player_num} players.`);

          console.log(Rooms)

          io.emit('emit_rooms', {Rooms}); // Notify all clients of the new user lists
    
          // Optionally, remove the room if no players are left
          if (roomData.player_num <= 0) {
            Rooms = Rooms.filter(r => r.room !== room);
            console.log(`Room ${room} has been removed as there are no players left.`);

            io.emit('emit_rooms', {Rooms}); // Notify all clients of the new user lists
          }
    
          // Notify the room of the updated player count
          io.to(room).emit('emit_rooms', { Rooms });
        }
    
        // Notify the room that the user has disconnected and update the user list
        io.to(room).emit('updateUsers', user_names);
    
        console.log(`Remaining users in room ${room}:`, user_names);
      } else {
        console.log(`A user with socket ID ${socket.id} has disconnected`);
      }
    });
    
    


  });


  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });