/*
This is a middleware which restrict to logged in user only.
Get the userUid from req.cookies.uid
*/

const { getUser } = require('../service/auth');

async function restrictToLoggedinUserOnly(req, res, next) {


    const userUid = req.cookies?.uid;       //run only if exits
    if(!userUid) return res.redirect('/login');    //redirect to login page
    const user = getUser(userUid);
    //Incase of UserId not present
    if(!user) {
        return res.redirect('/login');

    }

    req.user = user;            //add the user in that request Object
    next();

}
async function checkAuth(req, res, next) {
    const userUid = req.cookies?.uid;       //run only if exits
    
    const user = getUser(userUid);
    //Incase of UserId not present
    req.user = user;

    next();


}

module.exports = {
    restrictToLoggedinUserOnly,
    checkAuth,
}