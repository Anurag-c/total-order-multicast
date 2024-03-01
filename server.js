const express = require("express");
const { NETWORK_PORT } = require("./config");
const http = require("http");
const socketIo = require("socket.io");
const { randomSleep } = require("./utils");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Handle socket connection
io.on("connection", (socket) => {
  console.log(`Middleware-${socket.id} connected to Network server`);

  socket.on("broadcast_event", async (data) => {
    await randomSleep(1000); // random delay for sending broadcast messages
    io.emit("message", data);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Middleware-${socket.id} Disconnected from Network server`);
  });
});

// Start the server
server.listen(NETWORK_PORT, () => {
  console.log(`socket server running on port ${NETWORK_PORT}`);
});
