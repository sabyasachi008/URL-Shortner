const jwt = require("jsonwebtoken");
const secret = "sab@123$g"

//Token assignment for User.
function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role,
    }, secret);
}

//Verify the token with secret key
function getUser(token) {
    if(!token) return null;         //if no token provided return null; 
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}


/**Your tokens can be change only by someone who has your secret key
 * 
 * Work flow -> JWT.SIGN -> when we sign we are using a secret key
 * after that we are trying to verify it with our secret key  
 */