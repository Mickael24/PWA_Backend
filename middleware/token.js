const Users = require('../data/users');

module.exports = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' })
    }

    Users.verifyToken(token)
      .then((decoded) => {
        req.id = decoded.id;
        req.roleUser = decoded.role;
        next();
      })
      .catch(() => {
        res.status(401).send({ auth: false, message: 'Not authorized' })
      })
};