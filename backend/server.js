const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const {emitRoomClients} = require("./eventHandlers");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// io.sockets, is simply an alias for io.of("/"), default namespace is "/"
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    socket.username = data.username;
    console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    emitRoomClients(data.room, io);
  });

  socket.on("get_room_clients", (room) => {
    emitRoomClients(room, io);
  });

  socket.on("send_message", (data) => {
    io.in(data.room).emit("receive_message", data);
  });

  socket.on("remove_message", (data) => {
    io.in(data.room).emit("remove_message", data.username);
  });

  socket.on("fade_message", (data) => {
    io.in(data.room).emit("fade_message", data.username);
  });

  socket.on("change_username", ({username, room}) => {
    console.log(username);
    socket.username = username;
    emitRoomClients(room, io);
    console.log(`User with ID: ${socket.id} changed username to: ${username}`);
  });

  // Use disconnecting to get rooms before the socket disconnects
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      // All sockets are join in their own room by default
      if (room !== socket.id) {
        emitRoomClients(room, io);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Backend app running");
});
