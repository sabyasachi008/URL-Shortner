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
const cookieParser = require('cookie-parser');
const { checkForAuthentication, restrictTo } = require('./middlewares/auth');

connectToMongoDB("mongodb://localhost:27017/short-url").then(()=>{

    console.log("MongoDB Connected!...")
})

// connectToMongoDB("mongodb://localhost:27017/short-url")
//   .then(() => {
//     console.log("MongoDB Connected!...");

//     app.listen(PORT, () =>
//       console.log(`Server running at PORT ${PORT}`)
//     );
//   })
//   .catch(err => {
//     console.error("MongoDB connection failed:", err);
//   });

app.set("view engine", "ejs");
//ejs files are basically html files

app.set("views", path.join(__dirname,'../client'))
//telling express that all the ejs files are in client.

        
app.use(express.json());        //support json data
app.use(cookieParser());
app.use(express.urlencoded({ extended:false}))      // to parse form data we need a middleware -> urlencoded

/*This is a inline middle ware which only work when the request would come to /url .
Basically to access any-thing inside /url route we have to be logged in
*/
app.use(checkForAuthentication)
app.use("/url", restrictTo(["NORMAL"]), urlRoute);
app.use('/user', userRoute);
app.use("/",  staticRoute);

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
