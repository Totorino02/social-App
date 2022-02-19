const User = require("../models/user");

const follow = (req, res)=>{
    const {fId} = req.params;
    const uId = req.userId
    User.findOne({_id:uId})
        .then(user =>{
            let {followings} = user;
            User.findOne({_id: fId, isVerified: true})
                .then( fuser=>{
                    if(!fuser) return res.status(401).json({message:"Error user not found"});

                    const followedUser = followings.filter(elem => elem._id == fId);
                    let {followers} = fuser;
                    if(followedUser.length == 0){
                        followers.push(uId);
                        followings.push(fId);
                    }else{
                        followings = followings.filter(elem => elem._id != fId);
                        user.followings = followings
                        followers = followers.filter(elem => elem._id != uId)
                        fuser.followers = followers;
                    }
                    //ipdate users
                    User.updateOne({_id:uId},{followings: followings})
                    .then(() => {
                        User.updateOne({_id:fId},{followers: followers})
                        .then(() => res.status(201).json({message:"Follow/Unfollow successfully"}))
                        .catch(error => res.status(401).json({message:"Something went wrong"}));
                    })
                    .catch(error => res.status(401).json({message:"Something went wrong"}));
                })
                .catch(error => res.status(401).json({message:"Something went wrong"}));
        })
        .catch(error => res.status(401).json({message:`Something went wrong ! ${error.message}`}));
};

module.exports = follow;