
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
        flash = require("connect-flash"),

        Campground = require("./models/campground"),
        Comment   = require("./models/comment"),
        User = require("./models/user"),
        seedDB = require("./public/js/seeds");

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
app.use(flash());

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

mongoose.connect("mongodb+srv://yelp-camp:Maurizio1@yelp-camp-kuuwp.mongodb.net/Yelp-Camp?retryWrites=true&w=majority", { 
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => {
    console.log('Connected to DB!');
}).catch(err => {
    console.log("ERROR: ", err.message);
});

app.use((req, res, next) => {
    // Middleware to pass the user info to every page, this is done to avoid passing
    // res.render("/foo", {currentUser: req.user});
    // every time

    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//#################################################################
// Database Initialization
//#################################################################
// seedDB();

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(3000, ()=>{
    console.log("Server started on port " + process.env.PORT + " ...");
})