if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
// const MONGO_URL = ('mongodb://127.0.0.1:27017/Wanderlust');
const dbUrl = process.env.MONGO_DB_URL;
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const UserModel = require("./models/user.js");



main().then((res) => {
    console.log(res);
})
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);

}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
         },
        touchAfter: 24 * 3600,
     });
     
 store.on("err" , () => {
    console.log("ERROR IN MONGO_SESSION" , err);
 })
const sessionOption = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(UserModel.authenticate()));

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// for non-existential routes
// ✅ This works regardless of which library version is installed
app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render("listings/error.ejs", { message })

})
app.listen("8080", () => {
    console.log("Server is listening to port 8080");
});