const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let authHeader = req.headers.token;

  if (authHeader) {
    authHeader = authHeader.split(" ")[1];

    await jwt.verify(authHeader, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(403).json("token is not valid");
        return;
      }
      req.user = user;

      next();
    });
    return;
  } else {
    res.status(401).json("You are not authenticated");
    return;
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin === true) {
      next();
    } else {
      res.status(403).json("you are not allowed to do that");
      return;
    }
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("you are not allowed to do that");
      return;
    }
  });
};
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
