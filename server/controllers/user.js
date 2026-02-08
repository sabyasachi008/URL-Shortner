const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { setUser } = require('../service/auth');

async function handleUserSignUp(req, res) {

    const { name, email, password } = req.body;


    await User.create({
        name,
        email,
        password,
    })

    return res.redirect("/");
    //if valid user/password
    //render home page

}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    // console.log("Login attempt:", email); debugging purpose
    const user = await User.findOne({
        email,
        password
    });
    // console.log("user", user);   //-> for debugging
 

    //if user not found
    if(!user) {
        // console.log("User not found or invalid password");       //for debugging
        return res.render("login", {
            error: "Invalid Credentials"
        });
    }

    
    const sessionId = uuidv4();
    //we have to store the sessionID with the user Object
    setUser(sessionId, user);
    //Now create a cookie
    res.cookie('uid', sessionId);           //so see the cookie in the browser
    /**
     * Go to inspect element ->  applications tab -> cookie Section after login you should see a cookie if your code is working correctly 
     */

    return res.redirect("/");
}

module.exports = {
    handleUserSignUp,
    handleUserLogin,
}