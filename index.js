const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require('path');
const socketIo = require('socket.io');
const swagguerUI = require('swagger-ui-express');
const swaggerDocument = require('./doc/api.json');

const config = require('./config');
const hostname = "localhost";
const port = 5000;

mongoose.connect(config.db)
.then(() => console.log('Conection successful!'))
.catch((err) => console.error(err));

let router = require('./router');

var app = express();

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://*:*", //allow all IPs and All ports
  }
})

io.on("connection", (socket) => {
  console.log('Socket, new connection', socket.id);

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    socket.disconnect()
  });
})

app.use(router.init(io));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/api-docs', swagguerUI.serve, swagguerUI.setup(swaggerDocument));

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});