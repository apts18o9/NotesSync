const jwt = require('jsonwebtoken');


function authenticateToken(req,res, next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    // console.log("Received token:", token);
    if(!token) return res.sendStatus(401);

     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=> {
        if(err) {
            // console.log("JWT verify error:", err);
            return res.sendStatus(401);
            
        }
        // console.log("decoded user", user)
        req.user = user; //no need to destructure user 
        next();
    });
}

module.exports = {
    authenticateToken
}