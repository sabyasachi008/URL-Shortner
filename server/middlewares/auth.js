/*
This is a middleware which restrict to logged in user only.
Get the userUid from req.cookies.uid
*/

const { getUser } = require('../service/auth');

//This is authentication 
function checkForAuthentication(req, res, next) {
    const tokenCookie = req.cookies?.token;
    req.user = null;        //Initially request.user doestn't exists
    
    //if no authorization header is present or it doesn't start with "Bearer "
    //If authorizationHeader doesn't exits or doesn't starts with Bearer then call the next function
    if(!tokenCookie) {
        return next();  //move to next middleware
    }

    const token = tokenCookie;    //extract the token value
    try {
        const user = getUser(token);
        
        req.user = user;

    } catch (error) {
        req.user = null;
    }

    return next();
}

//this is authorisation 
function restrictTo(roles = []) {
    return function(req, res, next ) {
        
        if(!req.user) {
            return res.redirect('/login');
        }
        if(!roles.includes(req.user.role)) {
            return res.end("Unauthorized");
        }
        return next();
    }
}

module.exports = {
    checkForAuthentication,
    restrictTo,
}