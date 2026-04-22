const adminAuthMiddleware = (req, res, next) => {
  const token = "admin";
  const isAdmin = token === "admin";
  if (!isAdmin) {
    res.status(401).send("Unauthorized Request for admin!!!!!!!!!!!!!!!");
  } else {
    next();
  }
};

const userAuthMiddleware = (req, res, next) => {
  const token = "user";
  const isUser = token === "user";
  if (!isUser) {
    res.status(401).send("Unauthorized Request for user!!!!!!!!!!!!!!!!");
  } else {
    next();
  }
};

module.exports = { adminAuthMiddleware, userAuthMiddleware };
