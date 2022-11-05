const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require('cookie-parser');
const VerifyToken = require('../middleware/Token');

function AuthRouter() {
  let router = express();

  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post(function (req, res, next) {
    const body = req.body;
    
    const { role } = body;

    if(!role.scopes.includes('admin')) {
      return res.status(401).send({ auth: false, message: 'Only create Admin' })
    }

    Users.create(body)
      .then(() => Users.createToken(body))
      .then((response) => {
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
        next();
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((response) => {
        console.log('response', response)
        // The httpOnly: true setting means that the cookie can’t be read using JavaScript but can still be sent back to the server in HTTP requests
        res.cookie("token", response.token, { httpOnly: true });
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        console.log('error', err);
        res.status(500);
        res.send(err);
      });
  });

  router.use(cookieParser()); // Adicionar esta verificação
  router.use(VerifyToken); // Adicionar esta verificação

  router.route("/logout").get(function (req, res, next) {
    // The httpOnly: true setting means that the cookie can’t be read using JavaScript but can still be sent back to the server in HTTP requests
    // MaxAge : It allows us to invalidate the cookie
    res.cookie("token", req.cookies.token, { httpOnly: true, maxAge: 0 });

    res.status(200);
    res.send({ logout: true });
    next();
  });

  router.route("/me").get(function(req, res, next)  {
    return new Promise(() => {
      res.status(202).send({ auth:true, decoded: req.roleUser });
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
      next();
    });
  });

  return router;
}

module.exports = AuthRouter;
