const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use("/styles", express.static("styles"));

let campgrounds = [
    {name: "Salmon Creek", image: "https://image.shutterstock.com/image-photo/quiet-campsite-on-bell-lake-260nw-1270124428.jpg"},
    {name: "Granite Hill", image: "https://assets.bedful.com/images/334484fb3277ecac8cd9557dd96941de46c4e315/small.jpg"}
];

app.get("/", (req, res)=>{
    res.render("landing");
})

app.get("/campgrounds", (req, res)=>{    

    res.render("campgrounds", {campgrounds: campgrounds});
})

app.post("/campgrounds", function(req, res){
    //get data from form and redirect to campgrounds page    
    const name = req.body.name;
    const image = req.body.image;
    const newCamp = {name: name, image: image};
    
    campgrounds.push(newCamp);
    
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.get("/test", function(req, res){
    res.render("test");
});

app.listen(3000, ()=>{
    console.log("Server started...");
})