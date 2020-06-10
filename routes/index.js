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
            console.log(err);
            return res.redirect("/register");
        }
            
        passport.authenticate("local")(req, res, () => {
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
        failureRedirect: "/login"

    }), (req, res) => {
});

// Logout
router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/campgrounds");
});

module.exports = router;