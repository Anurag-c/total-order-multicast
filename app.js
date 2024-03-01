const socketClient = require("socket.io-client");
const { MIDDLEWARE_URL, NUM_APPS } = require("./config");

function App(number, outputCollector) {
  const middleSocket = socketClient(MIDDLEWARE_URL);

  function send() {
    middleSocket.emit("broadcast_event", {
      message: `Hello world from APP-${number}`,
    });
  }

  middleSocket.on("connect", async () => {
    console.log(`App-${middleSocket.id} Connected to Middleware`);
  });

  middleSocket.on("message", (data) => {
    outputCollector.push(data.message);
  });

  middleSocket.on("disconnect", () => {
    console.log(`App-${middleSocket.id} Disconnected from Middleware`);
  });

  return {
    send,
  };
}

module.exports = { App };
