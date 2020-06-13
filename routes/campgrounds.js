//#################################################################
// Campgrounds Routes
//#################################################################
const   express = require("express"),
        router = express.Router(),
        Campground = require("../models/campground"),
        Comment   = require("../models/comment"),
        middleware = require("../middleware/myMiddleware");

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
router.post("/", middleware.isLoggedIn, (req, res)=>{
    //get data from form and redirect to campgrounds page    

    const newCamp = {
        name: req.body.name,
        image: req.body.image, 
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - Displays info about one campground
    // NB that this route contains the route "/campgrounds/new", therefore to be able 
    // to access "/campgrounds/new", we need to place this after
router.get("/:id", async (req, res) => {
    let campground_id = req.params.id;
    let campground = await Campground.findById(campground_id).populate("comments").exec();

    console.log(campground);
    
    res.render("campgrounds/show", {campground: campground});
});

// EDIT
router.get("/:id/edit", async (req, res) => {
    let campground_id = req.params.id;
    let campground = await Campground.findById(campground_id).populate("comments").exec();
    res.render("campgrounds/edit", {campground: campground});
})

// UPDATE
router.put("/:id", middleware.isAuthorizedCamp, async (req, res) => {
    const updatedCamp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground); 
    res.redirect("/campgrounds");
});

// Campground Delete
router.delete("/:id", middleware.isAuthorizedCamp, async (req, res)=>{
    // Checking if author wants to delete comment
    
    const deleted_camp = await Campground.findByIdAndDelete(req.body.campground);        
    res.redirect("/campgrounds");
});

module.exports = router;