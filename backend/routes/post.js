const multer = require('multer');
const { createPost, deletePost, showPost, like, comment } = require('../controllers/postController');
const { authVerification } = require('../controllers/userController');
const { postStorage } = require('../utils/saveImage');
const router = require('express').Router();

const upload = multer({storage: postStorage}).fields([{name: 'image', maxCount:8}])

router.post("/create", authVerification, upload, createPost);

router.delete("/delete/:id", authVerification, deletePost)

router.get("/:id", authVerification, showPost)

router.post("/like/:id", authVerification, like);

router.post("/comment/:id", authVerification, comment);



module.exports = router;