const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    images:{
        type: [{mage: String}],
        required: true
    },
    message:{type: String, required:false},
    likers: {
        type:[{userId:mongoose.Types.ObjectId}],
        default: [], required: false
    },
    comments: {
        type: [{userId: mongoose.Types.ObjectId, message: String, date: Date}],
        required: false,
        default: []
    },
    createdAt:{type:Date, required:true, default:Date.now()}
});

module.exports = mongoose.model("Post", postSchema);