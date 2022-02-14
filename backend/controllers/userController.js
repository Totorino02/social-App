const User = require("../models/user");
const bcrypt = require("bcrypt");
const Userverification = require("../models/userVerification");
const sendMail = require("../utils/sendMail");


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

module.exports = {
    register,
    login,
    verifyCount
};