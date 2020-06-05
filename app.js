const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Campground = require("./models/campground");
const Comment   = require("./models/comment");
const seedDB = require("./seeds");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });  

// seedDB();

app.get("/", (req, res)=>{
    res.render("landing");
})

// INDEX - Displays all the campgrounds
app.get("/campgrounds", (req, res)=>{

    //Accessing database for campgrounds
    Campground.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });

})

// CREATE - Adds a campground
app.post("/campgrounds", (req, res)=>{
    //get data from form and redirect to campgrounds page    
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCamp = {name: name, image: image, description: description};
    
    Campground.create(newCamp, (err, campground)=>{
                if (err){
                    console.log(err);
                } else{
                    console.log("Campground Inserted");
                    console.log(campground);

                    //redirect back to campgrounds page
                    res.redirect("/campgrounds");
                }
            }
    );        
});

// NEW - Displays form to add campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

// SHOW - Displays info about one campground
    // NB that this route contains the route "/campgrounds/new", therefore to be able 
    // to access "/campgrounds/new", we need to place this after
app.get("/campgrounds/:id", async (req, res) => {
    let campground_id = req.params.id;
    console.log(campground_id);

    let campground = await Campground.findById(campground_id).populate("comments").exec();
    res.render("campgrounds/show", {campground: campground});
});

// ADDs new comment
app.post("/campgrounds/:id/comments", async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    const new_comment = await Comment.create(
        {
            text: req.body.comment,
            author: "Homer"
        }
    );

    await campground.comments.push(new_comment);
    await campground.save();
    console.log("Created new comment");

    res.redirect("/campgrounds/" + req.params.id); 
});

//Removes Comment
app.delete("/campgrounds/:id/comments", async (req, res)=>{
    const deleted_comment = await Comment.findByIdAndDelete(req.body.comment);
    console.log("Deleting comment " + deleted_comment);
    
    res.redirect("/campgrounds/" + req.params.id);
});

app.listen(3000, ()=>{
    console.log("Server started...");
})