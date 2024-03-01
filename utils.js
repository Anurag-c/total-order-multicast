function randomSleep(ms) {
  const randomDelay = Math.floor(Math.random() * ms);
  return new Promise((resolve) => setTimeout(resolve, randomDelay));
}

module.exports = { randomSleep };
