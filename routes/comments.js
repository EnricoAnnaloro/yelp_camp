//#################################################################
// Comments Routes
//#################################################################
const   express = require("express"),
        router = express.Router({mergeParams:true}),
        Campground = require("../models/campground"),
        Comment   = require("../models/comment"),
        middleware = require("../middleware/myMiddleware");

        
// Comment New
router.post("/", middleware.isLoggedIn, async (req, res) => {
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

    req.flash("success", "Comment Succesfully Added!");     
    res.redirect("/campgrounds/" + req.params.id); 
});

// UPDATE
router.put("/", middleware.isAuthorizedComment, async (req, res) => {
    const newComm = {
        text: req.body.comment
    }
    const toBe = await Comment.findById(req.body.comment_id);
    const updatedComment = await Comment.findByIdAndUpdate(req.body.comment_id, newComm); 

    req.flash("success", "Comment Succesfully Modified!");     
    res.redirect("/campgrounds/" + req.params.id);
});

// Comment Delete
router.delete("/", middleware.isAuthorizedComment, async (req, res)=>{
    // Checking if author wants to delete comment
    
    const deleted_comment = await Comment.findByIdAndDelete(req.body.comment_id);
    req.flash("success", "Comment Succesfully Deleted!");             
    res.redirect("/campgrounds/" + req.params.id);
});



module.exports = router;