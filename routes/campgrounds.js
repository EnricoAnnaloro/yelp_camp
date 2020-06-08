//#################################################################
// Campgrounds Routes
//#################################################################
const   express = require("express"),
        router = express.Router(),
        Campground = require("../models/campground"),
        Comment   = require("../models/comment");

// Campgrounds Show
router.get("/", (req, res)=>{

    //Accessing database for campgrounds
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });

})

// Campground Create
router.post("/", (req, res)=>{
    //get data from form and redirect to campgrounds page    
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCamp = {name: name, image: image, description: description};
    
    Campground.create(newCamp, (err, campground)=>{
                if (err){
                    console.log(err);
                } else{
                    //redirect back to campgrounds page
                    res.redirect("/campgrounds");
                }
            }
    );        
});

// Campground New FORM
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - Displays info about one campground
    // NB that this route contains the route "/campgrounds/new", therefore to be able 
    // to access "/campgrounds/new", we need to place this after
router.get("/:id", async (req, res) => {
    let campground_id = req.params.id;
    let campground = await Campground.findById(campground_id).populate("comments").exec();
    res.render("campgrounds/show", {campground: campground});
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

module.exports = router;