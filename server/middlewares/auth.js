/*
This is a middleware which restrict to logged in user only.
Get the userUid from req.cookies.uid
*/

async function restricToLoggedinUserOnly(req, res, next) {

    const userUid = req.cookies.uid;

    if(!userUid) return res.redirect('/login'); 
}