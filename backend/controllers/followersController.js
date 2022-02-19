const User = require("../models/user");

const follow = (req, res)=>{
    const {fId} = req.params;
    const uId = req.userId
    User.findOne({_id:uId})
        .then(user =>{
            console.log(user);
            const {followers} = user;
            console.log(followers)

            const follower = followers.filter(flwId => flwId == fId);
            if(follower.lenght == 0){
                nFlws = followers.filter(flwId => flwId != fId);
                user.followers = nFlws;
                console.log(nFlws)
            }else{
                console.log(fId)
                nFlws = follower.push({fId});
                console.log(nFlws)
                user.followers = nFlws;
            }
            //console.log(user)
        })
        .catch(error => console.log(error.message))
};

module.exports = follow;