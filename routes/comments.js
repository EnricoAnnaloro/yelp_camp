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
    const author = {
        id: req.user._id,
        username: req.user.username
    };

    const new_comment = await Comment.create(
        {
            text: req.body.comment,
            author: author
        }
    );

    // Saving comment inside campground
    await new_comment.save();
    await campground.comments.push(new_comment);
    await campground.save();

    res.redirect("/campgrounds/" + req.params.id); 
});

// Comment Delete
router.delete("/", isAuthorized, async (req, res)=>{
    // Checking if author wants to delete comment
    
    const deleted_comment = await Comment.findByIdAndDelete(req.body.comment);        
    res.redirect("/campgrounds/" + req.params.id);
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
    const commentToDelete = await Comment.findById(req.body.comment);
    if(req.user && commentToDelete.author.id.equals(req.user._id)){
        return next();
    } else {
        res.redirect("/");
    }
}

module.exports = router;