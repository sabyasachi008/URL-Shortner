const express = require('express');
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const URL = require('./models/url');

const app = express();
app.use(express.json());
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(
    console.log("MongoDB Connected!...")
)

app.use("/url", urlRoute);

//Get it from the dB increment the visitedcount and return it to the user
app.get('/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push:{
            visitHistory: {
                timestamp: Date.now(),
            }
        }
    });

    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`));
