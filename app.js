
//#################################################################
// Requirements
//#################################################################
const   express = require("express"),
        app = express(),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        methodOverride = require("method-override"),
        passport = require("passport"),
        localStrategy = require("passport-local"),

        Campground = require("./models/campground"),
        Comment   = require("./models/comment"),
        User = require("./models/user"),
        seedDB = require("./seeds");

const   commentsRoutes = require("./routes/comments"),
        campgroundRoutes = require("./routes/campgrounds"),
        indexRoutes = require("./routes/index");

//#################################################################
// App set-up
//#################################################################
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

//Passport configuration
app.use(require("express-session")({
    secret: "Yelp Camp App",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});  

app.use((req, res, next) => {
    // Middleware to pass the user info to every page, this is done to avoid passing
    // res.render("/foo", {currentUser: req.user});
    // every time

    res.locals.currentUser = req.user;
    next();
});



//#################################################################
// Database Initialization
//#################################################################
seedDB();

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(3000, ()=>{
    console.log("Server started...");
})