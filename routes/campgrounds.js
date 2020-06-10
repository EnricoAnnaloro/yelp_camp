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

// EDIT
router.get("/:id/edit", async (req, res) => {
    let campground_id = req.params.id;
    let campground = await Campground.findById(campground_id).populate("comments").exec();
    res.render("campgrounds/edit", {campground: campground});
})

// UPDATE
router.put("/:id", isAuthorized, async (req, res) => {
    const updatedCamp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground); 
    res.redirect("/campgrounds");
});

// Campground Delete
router.delete("/:id", isAuthorized, async (req, res)=>{
    // Checking if author wants to delete comment
    
    const deleted_camp = await Campground.findByIdAndDelete(req.body.campground);        
    res.redirect("/campgrounds");
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

async function isAuthorized(req, res, next){
    const toDelete = await Campground.findById(req.params.id);
    console.log(toDelete);

    if(req.user && toDelete.author.id.equals(req.user._id)){
        return next();
    } else {
        res.redirect("/");
    }
}

module.exports = router;