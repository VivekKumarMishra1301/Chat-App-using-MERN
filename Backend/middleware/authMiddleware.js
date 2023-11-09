const jwt = require('jsonwebtoken');
const User = require('../Models/user.js'); // Corrected import
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    // console.log(req.headers);
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) { // Notice the space after "Bearer"
        try {
            token = req.headers.authorization.split("Bearer ")[1]; // Corrected splitting
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded.id);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.log('hello');
            res.status(401);
            throw new Error("Not authorized, token failed"+error.message);
        }
    }
    // console.log(token);
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});

module.exports = { protect };
