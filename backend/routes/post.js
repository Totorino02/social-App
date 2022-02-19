const multer = require('multer');
const { createPost, deletePost } = require('../controllers/postController');
const { postStorage } = require('../utils/saveImage');
const router = require('express').Router();

const upload = multer({storage: postStorage});


router.post("/post",upload.fields([{name: 'image', maxCount:8}]), createPost);

router.delete("/post/:id",deletePost)




module.exports = router;