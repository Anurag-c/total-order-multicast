const socketClient = require("socket.io-client");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { randomUUID } = require("crypto");
const { NETWORK_URL, NUM_APPS, MIDDLEWARE_PORT } = require("./config");

function Middleware(appSocket) {
  // Connect to the Socket.IO server
  const networkSocket = socketClient(NETWORK_URL);
  const messageQueue = [];
  const acksMap = {};
  let timestamp = 0;

  function broadcast(data) {
    const { messageId, message, ack } = data;
    timestamp = timestamp + 1;
    delay = Math.floor(Math.random() * 100);

    if (ack) {
      data = {
        ack,
        id: messageId,
        senderAppId: appSocket.id,
        senderTimestamp: timestamp,
      };
    } else {
      data = {
        id: randomUUID(),
        senderAppId: appSocket.id,
        senderTimestamp: timestamp,
        message: message,
      };
    }

    networkSocket.emit("broadcast_event", data);
  }

  function handleDeliverMessage() {
    while (messageQueue.length > 0 && acksMap[messageQueue[0].id] == NUM_APPS) {
      delete acksMap[messageQueue[0].id];
      const data = messageQueue.shift();
      appSocket.emit("message", data);
    }
  }

  async function sendAck(messageId) {
    broadcast({ ack: true, messageId });
  }

  function handleIncomingMessage(data) {
    const { id, senderTimestamp, ack } = data;
    timestamp = Math.max(timestamp, senderTimestamp) + 1;

    if (ack) {
      if (acksMap.hasOwnProperty(id)) acksMap[id]++;
      else acksMap[id] = 1;
      console.log("recieved ack for ", id, " ", acksMap, appSocket.id);
      handleDeliverMessage();
      return;
    }

    messageQueue.push(data);
    messageQueue.sort((a, b) => {
      if (a.senderTimestamp === b.senderTimestamp) {
        return a.senderAppId.localeCompare(b.senderAppId);
      }
      return a.senderTimestamp - b.senderTimestamp;
    });

    sendAck(id); // no need to await
  }

  // Handle connection event
  networkSocket.on("connect", () => {
    console.log(
      `App-${appSocket.id} Middleware-${networkSocket.id} Connected to Network server`
    );
  });

  networkSocket.on("disconnect", () => {
    console.log(
      `App-${appSocket.id} Middleware-${networkSocket.id} Disconnected from Network server`
    );
  });

  // Handle message event
  networkSocket.on("message", handleIncomingMessage);

  return {
    broadcast,
    disconnect: networkSocket.disconnect.bind(networkSocket),
  };
}

const app = express();
const server = http.createServer(app);
const socketServer = socketIo(server);

// Handle socket connection
socketServer.on("connection", (socket) => {
  console.log(`App-${socket.id} Connected to Middleware`);

  const middleware = Middleware(socket);

  socket.on("broadcast_event", middleware.broadcast);

  // Handle disconnection
  socket.on("disconnect", () => {
    middleware.disconnect();
    console.log(`App-${socket.id} Disconnected from Middleware`);
  });
});

// Start the server;
server.listen(MIDDLEWARE_PORT, () => {
  console.log(`socket server running on port ${MIDDLEWARE_PORT}`);
});
