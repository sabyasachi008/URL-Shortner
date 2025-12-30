
const shortid = require("shortid");
const URL = require('../models/url');
async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"URL is required..."});
    const shortID = shortid();
    await URL.create({
        shortId: shortID, 
        redirectURL: body.url,
        visitHistory : [],            //empty initially
    })

    return res.json({id: shortID});
} 

//return the number of times the shortned url is getting clicked
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    return res.json({
        totalClicks: result.visitHistory.length,                //get the res
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortURL,
    handleGetAnalytics
}