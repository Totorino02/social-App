require('dotenv').config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Userverification = require("../models/userVerification");
const sendMail = require("../utils/sendMail");
const jwt = require('jsonwebtoken');

const register = async(req, res)=>{
    if(req.body.email){
        const {email} = req.body;
        User.find({email:email})
            .then(users =>{
                if(users.length > 0) return res.status(400).json({message:"The email is already exixts"});
                const salt = bcrypt.genSaltSync(10);
                bcrypt.hash(req.body.password, salt)
                    .then((hashedPass) =>{
                        const user = new User({
                            name: req.body.name,
                            username: req.body.username,
                            email: email,
                            dateOfBirth: req.body.dateOfBirth,
                            password: hashedPass,
                        });
                        user.save()
                            .then((user)=>{
                                //res.status(200).json({message: "Saved successfully"});
                                sendMail(user, res);
                            })
                            .catch(error =>{
                                return res.status(400).json({message:`Something went wrong ${error.message}`});
                            })
                    })
                    .catch(error => {
                        return res.status(400).json({message: `Something went wrong ${error.message}`});
                    })
            })
            .catch( error =>{
                return res.status(400).json({message: "Something went wrong 2"});
            });
    }else{
        return res.status(400).json({message: "The email field is empty"});
    }
};

const login = (req, res)=>{
    if(req.body.username && req.body.password){
        const {username, password} = req.body;
        User.findOne({username: username, isVerified: true})
            .then(user =>{
                if(!user){
                    return res.status(401).json({message:"Invalid credentials!"});
                }
                const hashedPass = user.password;

                //verify is the hanshedpass and plantpass matched
                const isMatched =  bcrypt.compareSync(password, hashedPass)
                if(!isMatched) return res.status(401).json({message:"Invalid credentials!"});

                //build the token 
                const token = jwt.sign({_id: user._id}, process.env.AUTH_SECRRET, {expiresIn: "6h"});

                res.cookie("auth_token",token); //setting cookie
                res.status(308).redirect("/api/home");

            }).catch((error) =>{
                return res.status(401).json({message:`Something went wronng! ${error.message}`});
            })
    }else{
        return res.status(401).json({message:"Email or password field was empty!"});
    }
};

const verifyCount = (req,res)=>{
    const {id, hashedId} = req.params;
    Userverification.find({userId: id})
        .then(userverification =>{
            if(userverification.length == 0) return res.status(400).json({message: "Oups Error Try to sign Up"});
                const {uniqueString, expiredAt} = userverification[0];
                if(expiredAt > Date.now()){
                    bcrypt.compare(hashedId, uniqueString)
                        .then(isMatched =>{
                            if(!isMatched) return res.status(400).json({message: "invalid url"});
                            User.updateOne({_id: id},{isVerified: true})
                                .then(()=>{
                                    Userverification.deleteOne({userId: id})
                                        .then(()=>{
                                            return res.status(200).json({message: "Verified Successfully"});
                                        })
                                        .catch(()=>{
                                            return res.status(400).json({message: "Oups Error Try to sign Up"});
                                        })
                                })
                                .catch()
                        })
                        .catch()
                }else{
                    Userverification.findOneAndDelete({userId: id})
                        .then(()=>{
                            User.findByIdAndDelete(_id);
                            return res.status(200).json({message: "Delay exceed, Try to sign in"});
                        })
                        .catch((error)=>{
                            return res.status(400).json({message: `Delay exceed error: ${error.message}`});
                        })
                }
        })
        .catch()
}

const changProfile = (req, res)=>{
    User.findById(req.userId)
        .then(()=> {
            User.findOneAndUpdate({_id:uid},{profileImage: req.file.filename})
                .then((user)=> res.status(200).json(user))
                .catch(()=> res.status(401).json({message: "Something went wrong"}));
        })
}

const authVerification = (req, res, next)=>{
    const token = req.cookies.auth_token
    if(!token){
        return res.status(401).json({message:"access denied !"});
    }else{
        try {
            const {_id} = jwt.verify(token, process.env.AUTH_SECRRET);
            req.userId = _id;
            next();
        } catch (error) {
            res.clearCookie("auth_token");
            return res.status(498).json({message:"Invalid credentials !"});
        }
    }
}


module.exports = {
    register,
    login,
    verifyCount,
    changProfile,
    authVerification
};