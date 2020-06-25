var mongoose = require("mongoose");
var Campground = require("../../models/campground");
var Comment   = require("../../models/comment");
var User = require("../../models/user");
 
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "One of the best places I have ever visited. I truly whish to be back there again next year"
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lovely place to find some peace but also some fun. You won't be disappointed"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "It cannot get better than this, on a sunny day, taking a walk through the canyon it's a lovely experience"
    }
]
 
async function seedDB(){
    //Remove all users
    await User.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("Users removed...");
        }
    })

    //Remove all campgrounds
    await Campground.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
        }
    });

    //Remove all comments
    await Comment.deleteMany({}, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log("removed comments!");
        }
    });

    //Creates user Admin
    const newUser = new User({username: "admin"});
    await User.register(newUser, "1", (err, user) => {
        if(err){
            console.log(err);
        } else {
            console.log("admin created...");
            console.log("username: admin");
            console.log("password: 1");
        }
    });
    await newUser.save();

    // for (let i = 0; i < 3; i++) {
    //     let data = {
    //         name: "Cloud's Rest", 
    //         image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    //         description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"

    //     }        
    // }

    //add a few campgrounds
    data.forEach( async (seed) => {

        const newAuthor = {
            id: newUser._id,
            username: newUser.username
        };

        seed.author = newAuthor;

        console.log(newAuthor);
        console.log(seed);

        const newCamp = await Campground.create(seed);

        console.log(newCamp);
        
        //create a comment
        
        console.log("added a campground");
        
        const newComment = await Comment.create(
            {
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
                author: newAuthor
            }
        );

        await newComment.save();
        await newCamp.comments.push(newComment);
        await newCamp.save();
    });            
}
 
module.exports = seedDB;