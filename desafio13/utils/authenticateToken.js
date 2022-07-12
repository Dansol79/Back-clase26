const jwt = require('jsonwebtoken');
const PRIVATE_KEY = 'secret';

module.exports = function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if(!authHeader) {
        return res.status(401).json({
            error:'No autentificado'
        });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY, (error, decoded) => {
        if(error){
            return res.status(403).json({
                error:'No autorizado'
        });
        }
        req.user = decoded.data;
        next();
    })
   
}
