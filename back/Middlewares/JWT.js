const jwt = require('jsonwebtoken');
require('dotenv').config();
function AuthToken(req, res, next) {
  const Authheader = req.headers["authorization"];
    const token = Authheader
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.ACCESS_WEB_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}
module.exports = AuthToken;