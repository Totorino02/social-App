require('dotenv').config();
const User = require("../models/user");
const Post = require("../models/post");


const createPost = (req, res)=>{
    let images = []
    req.files["image"].forEach(file => {
        images.push({image:file.filename});
    });
    let post = new Post({
        userId: req.userId,
        images: images,
        message : req.body.message
    })
    post.save()
        .then(()=> res.status(201).json(post))
        .catch((error)=> res.status(401).json({message: "Something Went Wrong"}));
};

const like = (req, res)=>{
    const uId = req.userId;
    const {id} = req.params;
    Post.findOne({_id:id, isDeleted:false})
        .then(post =>{
            post.likers.push(uId);
            Post.updateOne({_id:id},{likers:post.likers})
                .then(()=> res.status(200).json({message: "liked Successfully"}))
                .catch((error)=> res.status(401).json({message: "Something Went Wrong"}));
        })
        .catch((error)=> res.status(401).json({message: "Something Went Wrong"}));
}

const comment = (req,res)=>{

    const uId = req.userId;
    const {id} = req.params;
    const {message} = req.body;
    Post.findOne({_id:id, isDeleted:false})
        .then(post =>{
            post.comments.push({userId: uId, message: message, date: Date.now()});
            Post.updateOne({_id:id},{comments:post.comments})
                .then(()=> res.status(201).json({message: "Comment Successfully"}))
                .catch((error)=> res.status(401).json({message: "Something Went Wrong"}));
        })
        .catch((error)=> res.status(401).json({message: "Something Went Wrong"}));

}

const deletePost = (req, res)=>{
    if(req.params.id){
        const {id} = req.params;
            Post.findOneAndUpdate({_id: id},{isDeleted: true})
                .then(()=> res.status(200).json({message: "Delete Successfully"}))
                .catch(()=> res.status(400).json({message: "Something went wrong"}));
        }else{
        return res.status(401).json({message: "Invalid Url"});
    }
};

const showPost = (req,res)=>{
    if(req.params.id){
        const {id} = req.params;
        Post.findOne({_id: id, isDeleted:false})
            .then( post => res.status(200).json(post))
            .catch( error => res.status(401).json({message: "Something went wrong"}));
    }else{
        return res.status(401).json({message: "Invalid Url"});
    }
}

const allPost = (req, res)=>{
    Post.find({userId: req.userId, isDeleted:false})
        .then(posts => res.status(200).json(posts))
        .catch(()=> res.status(401).json({message: "Something went wrong"}));
}

module.exports = {
    createPost,
    deletePost,
    showPost,
    allPost,
    like,
    comment
}