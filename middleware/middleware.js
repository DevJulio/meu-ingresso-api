const admin = require("firebase-admin");

const checkIntegrity = async (req, res, next) => {
  const jwt = req.headers.authorization;
  let response = false;
  if (!jwt) {
    res.status(401).send({ message: "usuário não autorizado sem cadastro" });
    return;
  }
  await admin
    .auth()
    .verifyIdToken(jwt)
    .then(async (decodedToken) => {
      response = true;
      next();
    })
    .catch((error) => {
      console.log(error);
      res.status(401).send({ message: "usuário não autorizado" });
    });
};

module.exports = checkIntegrity;