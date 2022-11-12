const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require('path');

const config = require('./config');

const hostname = "localhost";
const port = 5000;

mongoose.connect(config.db)
.then(() => console.log('Conection successful!'))
.catch((err) => console.error(err));

let router = require('./router');
var app = express();
app.use(router.init());
app.use('/images', express.static(path.join(__dirname, 'images')))

const server = http.Server(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});