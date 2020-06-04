const mongoose = require("mongoose");

//Create the schema
const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
});

module.exports = mongoose.model("Comment", commentSchema);