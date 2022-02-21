const express = require("express");
const app = express();
const http = require("http");
const {Server} = require("socket.io");

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
    // Emit the updated room clients to all room clients
    io.in(data.room)
      .fetchSockets()
      .then((sockets) => {
        io.in(data.room).emit(
          "room_clients",
          sockets.map((socket) => socket.username)
        );
      });
  });

  socket.on("get_room_clients", (room) => {
    io.in(room)
      .fetchSockets()
      .then((sockets) => {
        io.in(room).emit(
          "room_clients",
          sockets.map((socket) => socket.username)
        );
      });
  });

  socket.on("send_message", (data) => {
    io.in(data.room).emit("receive_message", data);
  });

  // Use disconnecting to get rooms before the socket disconnects
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        io.in(room)
          .fetchSockets()
          .then((sockets) => {
            io.in(room).emit(
              "room_clients",
              sockets.map((socket) => socket.username)
            );
          });
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
