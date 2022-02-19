const multer = require('multer');
const path = require('path');


const postStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(process.cwd(),"images","posts"))
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+"."+file.originalname);
    }
})

const profileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(process.cwd(),"images","profiles"))
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+"."+file.originalname);
    }
})


module.exports = {
    postStorage,
    profileStorage
}