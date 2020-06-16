const   Campground = require("../models/campground"),
        Comment   = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

middlewareObj.isAuthorizedCamp = async (req, res, next) => {
    const toDelete = await Campground.findById(req.params.id);
    console.log(toDelete);

    if(req.user && toDelete.author.id.equals(req.user._id)){
        return next();
    } else {
        req.flash("error", "You don't have the authorization for this action!");
        res.redirect("back");
    }
}

middlewareObj.isAuthorizedComment = async (req, res, next) => {
    const commentToDelete = await Comment.findById(req.body.comment_id);
    if(req.user && commentToDelete.author.id.equals(req.user._id)){
        return next();
    } else {
        req.flash("error", "You don't have the authorization for this action!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;