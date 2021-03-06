const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId:{type: mongoose.Types.ObjectId, ref: 'User', required: true},
    images: {
        type: [{image: String}],
        required: true
    },
    message: {type: String, required: false},
    likers: {
        type:[{userId: mongoose.Types.ObjectId}],
        default: [], required: false
    },
    comments: {
        type: [{userId: mongoose.Types.ObjectId, message: String, date: Date}],
        required: false,
        default: []
    },
    createdAt: {type: Date, required: true, default: Date.now()},
    isDeleted: {type: Boolean, required: true, default: false}
    
});

module.exports = mongoose.model("Post", postSchema);