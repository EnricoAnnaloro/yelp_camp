//#################################################################
// INDEX ROUTES
//#################################################################
const   express = require("express"),
        router = express.Router(),
        passport = require("passport"),
        Campground = require("../models/campground"),
        Comment   = require("../models/comment"),
        User = require("../models/user");

// Landing Page
router.get("/", (req, res)=>{
    res.render("landing");
})

// New User Form
router.get("/register", async (req, res) => {
    res.render("authentication/register")
});

// User Create
router.post("/register", async (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);     
            return res.redirect("/register");
        }
            
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Yelp-Camp " + user.username + " !");     
            res.redirect("/campgrounds");
        })
    });
});

// Login Form
router.get("/login", async (req, res) => {
    res.render("authentication/login")
});

// Login 
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), (req, res) => {
});

// Logout
router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;