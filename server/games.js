const bodyParser = require("body-parser");
const express = require("express");
const Games = require("../data/games");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");

const GamesRouter = (io) => {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("/")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;

      Games.create(body)
        .then(() => {
          console.log("Created!");
          io.sockets.emit('admin_notifications', {
            message: 'Add new game',
            key: 'Game'
          });
          res.status(200);
          res.send(body);
          next();
        })
        .catch((err) => {
          console.log("Game already exists!");
          console.log(err.message);
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    })
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      function (req, res, next) {

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Games.findAll(req.pagination)
          .then((games) => {
            const response = {
              auth: true,
              ...games
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
    .route("/:gamesId")
    .get(function (req, res, next) {
      console.log("get a game by id");
      let gamesId = req.params.gamesId;
      Games.find(gamesId)
        .then((game) => {
          res.status(200);
          res.send(game);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    })
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a stadium by id");
      let gamesId = req.params.gamesId;
      let body = req.body;

      Games.update(gamesId, body)
        .then((player) => {
          res.status(200);
          res.send(player);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  return router;
};

module.exports = GamesRouter;
