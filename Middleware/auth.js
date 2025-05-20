const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET  ;

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login'); // Redirect to login if no token is found
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.admin = decoded.admin; // Store decoded admin information in request object
        next();
    } catch (error) {
        return res.redirect('/login'); // Redirect to login if no token is found
    }
}

module.exports = authenticateToken;
