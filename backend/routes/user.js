const { register, verifyCount, login, authVerification, changProfile, getUser } = require("../controllers/userController");
const router = require("express").Router();
const multer = require('multer');
const { profileStorage } = require("../utils/saveImage");

const upload = multer({storage: profileStorage}).single("profile");


router.post("/register", register);

router.post("/login", login);

router.get("/", authVerification, getUser);

router.put("/profile", authVerification, upload, changProfile);

router.get("/verification/:id/:hashedId", verifyCount);



module.exports = router;