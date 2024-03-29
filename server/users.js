const bodyParser = require("body-parser");
const express = require("express");
const Members = require("../data/member");
const Users = require("../data/users");
const scopes = require("../data/users/scopes");
const VerifyToken = require("../middleware/Token");
const cookieParser = require("cookie-parser");
const User = require("../data/users/users");

const UsersRouter = () => {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.use(cookieParser());
  router.use(VerifyToken);

  router
    .route("")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("Create user");
      let body = req.body;
      let { role } = body;

      if (!role.scopes.includes(scopes.NonMember)) {
        return res
          .status(401)
          .send({ auth: false, message: "Only create NonMembers" });
      }

      Users.create(body)
        .then((user) => {
          res.status(200);
          res.send();
          next();
        })
        .catch((err) => {
          console.log("erro", err);
          res.status(404);
          next();
        });
    })
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      function (req, res, next) {
        console.log("get all users");

        const pageLimit = req.query.limit ? parseInt(req.query.limit) : 5;
        const pageSkip = req.query.skip
          ? pageLimit * parseInt(req.query.skip)
          : 0;

        req.pagination = {
          limit: pageLimit,
          skip: pageSkip,
        };

        Users.findAll(req.pagination)
          .then((users) => {
            const response = {
              auth: true,
              ...users,
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
    .route("/:userId")
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a member by id");
      let userId = req.params.userId;
      let body = req.body;

      Users.update(userId, body)
        .then((user) => {
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  router
    .route("/:userId/member")
    .post(Users.autorize([scopes.Admin]), function (req, res, next) {
      let body = req.body;
      let userId = req.params.userId;

      //member update user.
      Members.create(body)
        .then((result) => {
          console.log(result);
          return Users.update(userId, { memberId: result.member._id });
        })
        .then((user) => {
          console.log("Created!");
          res.status(200);
          res.send(user);
          next();
        })
        .catch((err) => {
          console.log("Member already exists!");
          console.log(err);
          err.status = err.status || 500;
          res.status(401);
          next();
        });
    });

  router
    .route("/member")
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

        Members.findAll(req.pagination)
          .then((members) => {
            const response = {
              auth: true,
              members: members,
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
    .route("/member/:memberId")
    .put(Users.autorize([scopes.Admin]), function (req, res, next) {
      console.log("update a member by id");
      let memberId = req.params.memberId;
      let body = req.body;

      Members.update(memberId, body)
        .then((member) => {
          res.status(200);
          res.send(member);
          next();
        })
        .catch((err) => {
          res.status(404);
          next();
        });
    });

  router
    .route("/member/tax/:taxNumber")
    .get(
      Users.autorize([scopes.Admin, scopes.Member, scopes.NonMember]),
      function (req, res, next) {
        console.log("get the member by tax");

        let taxNumber = req.params.taxNumber;

        Members.findMemberByTaxNumber(taxNumber)
          .then((member) => {
            res.send(member);
            next();
          })
          .catch((err) => {
            console.log(err.message);
            next();
          });
      }
    );

  return router;
};

module.exports = UsersRouter;
