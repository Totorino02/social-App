const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: {type:String, required: true},
    username:{type:String, required: true, unique:true},
    email: {type:String, required: false},
    password: {type:String, required:true},
    phoneNumber: {type:Number, required:false},
    dateOfBirth: {type:Date, required:true},
    isAdmin: {type:Boolean, default:false},
    isVerified: {type:Boolean, default:false},
    profileImage:{type:String, required: false},
    profileInfo:{type: String, required: false},
    followers:{
        type: [{userId: mongoose.Types.ObjectId}],
        default: []
    },
    followings:{
        type: [{userId: mongoose.Types.ObjectId}],
        default: []
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);