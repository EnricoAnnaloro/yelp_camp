//#################################################################
// Comments Routes
//#################################################################
const   express = require("express"),
        router = express.Router({mergeParams:true}),
        Campground = require("../models/campground"),
        Comment   = require("../models/comment");

        
// Comment New
router.post("/", isLoggedIn, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const new_comment = await Comment.create(
        {
            text: req.body.comment,
            author: req.user.username
        }
    );

    // Saving comment inside campground
    await campground.comments.push(new_comment);
    await campground.save();

    res.redirect("/campgrounds/" + req.params.id); 
});

// Comment Delete
router.delete("/", async (req, res)=>{
    // Checking if author wants to delete comment
    
    const commentToDelete = await Comment.findById(req.body.comment);

    if(commentToDelete.author == req.user.username){
        // can cancel
        const deleted_comment = await Comment.findByIdAndDelete(req.body.comment);        
        res.redirect("/campgrounds/" + req.params.id);
    } else {
        // cannot cancel
        res.redirect("/campgrounds/" + req.params.id);
    }
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