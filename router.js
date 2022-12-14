let AuthAPI = require('./server/auth');
let StadiumAPI = require('./server/stadium');
let UsersAPI = require('./server/users');
let TicketsAPI = require('./server/tickets');
let GamesAPI = require('./server/games');
const express = require('express');

function init () {
    let api = express();

    api.use('/auth', AuthAPI());
    api.use('/stadium', StadiumAPI());
    api.use('/users', UsersAPI());
    api.use('/tickets', TicketsAPI());
    api.use('/games', GamesAPI());

    return api;
}

module.exports = {
    init: init,
}