const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

function getToken(authorizationHeader = "") {
  if (!authorizationHeader) return "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice(7).trim();
  }

  return authorizationHeader.trim();
}

module.exports = (req, res, next) => {
  try {
    const token = getToken(req.headers.authorization);

    if (!token) return res.status(401).json("No token");

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};
