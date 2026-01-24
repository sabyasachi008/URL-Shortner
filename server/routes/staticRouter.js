const express = require('express');

const router = express.Router();


// '/' -> refers to Home Page
router.get('/', (req, res)=> {
    return res.render("home");
});



module.exports = router;