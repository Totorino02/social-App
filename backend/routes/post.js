const multer = require('multer');
const { createPost, deletePost, showPost, like, comment, allPost } = require('../controllers/postController');
const { authVerification } = require('../controllers/userController');
const { postStorage } = require('../utils/saveImage');
const router = require('express').Router();

const upload = multer({storage: postStorage}).fields([{name: 'image', maxCount:8}])

router.post("/create", authVerification, upload, createPost);

router.get("/all", allPost);

router.get("/:id", authVerification, showPost);

router.delete("/delete/:id", authVerification, deletePost)

router.get("/:id", authVerification, showPost)

router.put("/like/:id", authVerification, like);

router.put("/comment/:id", authVerification, comment);



module.exports = router;