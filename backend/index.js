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

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data, callback) => {
    try {
      socket.join(data);
      callback({successfullyJoined: true, error: null});
      console.log(`User with ID: ${socket.id} joined room: ${data}`);
    } catch (error) {
      callback({successfullyJoined: false, error: error});
    }
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Backend app running");
});
