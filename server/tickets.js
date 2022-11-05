const bodyParser = require("body-parser");
const express = require("express");
const Tickets = require("../data/tickets");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");

const TicketsRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/user")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;

      Tickets.create(body)
        .then((result) => {
          console.log('ticket', result.ticket.userId);
          return Users.update(result.ticket.userId, {
            tickets: [result.ticket._id],
          });
        })
        .then((ticket) => {
          console.log("Created!");
          res.status(200);
          res.send(ticket);
          next();
        })
        .catch((err) => {
          console.log(err);
          console.log("Ticket already exists!");
          console.log(err.message);
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    });

  router
    .route("/")
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      function (req, res, next) {
        console.log("get all tickets");

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Tickets.findAll(req.pagination)
          .then((tickets) => {
            const response = {
              auth: true,
              tickets: tickets,
            };
            res.send(response);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            next();
          });
      }
    );

  router
    .route("/:ticketId")
    .get(function (req, res, next) {
      console.log("get a ticket by id");
      let ticketId = req.params.ticketId;
      Tickets.find(ticketId)
        .then((ticket) => {
          res.status(200);
          res.send(ticket);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a ticket by id");
      let ticketId = req.params.ticketId;
      let body = req.body;

      Tickets.update(ticketId, body)
        .then((ticket) => {
          res.status(200);
          res.send(ticket);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  router.route("/game/:gameId").get(function (req, res, next) {
    console.log("get a game by id");
    let gameId = req.params.gameId;
    Tickets.findTicketsByGame(gameId)
      .then((game) => {
        res.status(200);
        res.send(game);
        next();
      })
      .catch((err) => {
        res.status(404);
        next();
      });
  });

  return router;
};

module.exports = TicketsRouter;
