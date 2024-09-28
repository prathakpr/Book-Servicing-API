const jwt = require("jsonwebtoken");

// middleware to ensure the JWT
const verifyToken  = (req, res, next) =>{
    const token = req.headers['auth_token'];
    if(!token) return res.status(401).send("INVALID AUTHORIZATION");
    
    jwt.verify(token,'pulkits secret', (err, decoded)=>{
        if(err) return res.status(401).send("WRONG CREDENTIAL");
        req.user = decoded;
        next();
    })
    };

module.exports = verifyToken;