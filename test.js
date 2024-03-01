const { App } = require("./app");
const { NUM_APPS } = require("./config");

function test() {
  const outputs = [];
  for (let i = 1; i <= NUM_APPS; i++) {
    outputs.push([]);
  }

  for (let i = 1; i <= NUM_APPS; i++) {
    const app = App(i, outputs[i - 1]);
    app.send();
  }

  console.log("\nStatus will be printed after 10 seconds....\n");
  setTimeout(() => {
    for (let i = 1; i <= NUM_APPS; i++) {
      console.log(`Messages at APP-${i} : \n`);
      console.log(outputs[i - 1]);
    }
  }, 10000);
}

test();
