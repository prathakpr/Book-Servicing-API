const jwt = require("jsonwebtoken");

// Middleware to ensure the JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Use 'authorization' header
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) return res.status(401).send("INVALID AUTHORIZATION");

  jwt.verify(token, "pulkits secret", (err, decoded) => {
    if (err) return res.status(401).send("WRONG CREDENTIAL");
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;