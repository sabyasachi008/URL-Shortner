const express = require('express');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
const path = require('path')
const app = express();
const PORT = 8001;

//Routes import ->
const urlRoute = require('./routes/url');
const staticRoute = require("./routes/staticRouter");
const userRoute = require('./routes/user')

connectToMongoDB("mongodb://localhost:27017/short-url").then(
    console.log("MongoDB Connected!...")
)


app.set("view engine", "ejs");
//ejs files are basically html files

app.set("views", path.join(__dirname,'../client'))
//telling express that all the ejs files are in client.

        
app.use(express.json());        //support json data
app.use(express.urlencoded({ extended:false}))      // to parse form data we need a middleware -> urlencoded
app.use("/url", urlRoute);
app.use("/", staticRoute);
app.use('/user', userRoute);

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        }
    }
    );

    if (!entry) return res.status(404).json({ error: "Short URL not found..." });

    res.redirect(entry.redirectURL);
})

app.listen(PORT, () => console.log(`Server running at PORT ${PORT}`));
