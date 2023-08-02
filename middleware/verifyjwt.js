const jwt = require('jsonwebtoken');

const verifyjwt = (req,res,next) =>{
    // console.log(req.headers);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return res.sendStatus(401); // Unauthorized
      }
    
      const token = authHeader.slice(7);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
          return res.sendStatus(403); // Forbidden - Invalid Token
        }
    
        // The token is valid, attach the decoded data to the request for later use
        req.user = decode.Username;
        next();
      });
    }

module.exports = verifyjwt;