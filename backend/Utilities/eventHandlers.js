// Emit the updated room clients to all room clients
const emitRoomClients = (room, io) => {
  io.in(room)
    .fetchSockets()
    .then((sockets) => {
      io.in(room).emit(
        "room_clients",
        sockets.map((socket) => socket.username)
      );
    });
};

exports.emitRoomClients = emitRoomClients;
