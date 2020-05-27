const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use("/styles", express.static("styles"));

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

//Create the schema
const campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campgrounds = new mongoose.model("Campgrounds", campgroundsSchema);

// const startCamp = {
//     name: "Camp 1",
//     image: "",
//     description: "This is the Camp 1 description"
// }

// Campgrounds.create(startCamp, (err, campground)=>{
//     if (err){
//         console.log(err);
//     } else{
//         console.log("Campground Inserted");
//         console.log(campground);
//     }
// });        

app.get("/", (req, res)=>{
    res.render("landing");
})

// INDEX - Displays all the campgrounds
app.get("/campgrounds", (req, res)=>{

    //Accessing database for campgrounds
    Campgrounds.find({}, (err, allCampgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render("index", {campgrounds: allCampgrounds});
        }
    });

})

// CREATE - Adds a campground
app.post("/campgrounds", function(req, res){
    //get data from form and redirect to campgrounds page    
    const name = req.body.name;
    const image = req.body.image;
    const newCamp = {name: name, image: image};
    
    Campgrounds.create(newCamp, (err, campground)=>{
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
    res.render("new");
});

// SHOW - Displays info about one campground
    // NB that this route contains the route "/campgrounds/new", therefore to be able 
    // to access "/campgrounds/new", we need to place this after
app.get("/campgrounds/:id", function(req, res){
    campground_id = req.params.id;

    Campgrounds.findById(campground_id, (err, campground)=>{
        if(err){
            console.log(err);
        } else {
            res.render("show", {campground: campground});
        }
    });
});

app.listen(3000, ()=>{
    console.log("Server started...");
})