
const User = require('../models/user')

async function handleUserSignUp(req, res) {

    const { name, email, password } = req.body;


    await User.create({

        name,
        email,
        password,
    })

    return res.render("home");
    //if valid user/password
    //render home page

}

module.exports = {
    handleUserSignUp,
}