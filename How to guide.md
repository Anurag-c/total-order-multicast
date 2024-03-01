## 1. Prerequisites

- Node.js: Ensure that Node.js is installed on your system. You can download the LTS from [https://nodejs.org/en](https://nodejs.org/en)

- npm Packages: Open a terminal and navigate to the project directory. Run the following command to install the required npm packages.

  ```js
  npm install
  ```

## 2. Set the configuration

- In `config.js`
- `NETWORK_URL`: The URL of the network server, set to "http://localhost:3000".
- `NETWORK_PORT`: The port number of the network server, set to 3000.
- `MIDDLEWARE_URL`: The URL of the middleware server, set to "http://localhost:8080".
- `MIDDLEWARE_PORT`: The port number of the middleware server, set to 8080.
- `NUM_APPS`: The number of applications in the environment, default set to 3.

## 3. Run the network server

- Open a new terminal and navigate to the project directory. Run the following command
  ```js
  node server.js
  ```

## 4. Run the middleware server

- Ensure the network server is running.
- Open a new terminal and navigate to the project directory. Run the following command
  ```js
  node middleware.js
  ```

## 5. Run the test file

- Ensure the network and middleware servers are running.
- In `config.js`, set the desired NUM_APPS. By default, it is assumed to be 3 applications.
- Open a new terminal and navigate to the project directory. Run the following command
  ```js
  node test.js
  ```
