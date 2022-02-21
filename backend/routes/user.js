const { register, verifyCount, login, authVerification, changProfile } = require("../controllers/userController");
const router = require("express").Router();


router.post("/register", register);

router.post("/login", login);

router.post("/profile", authVerification, changProfile);

router.get("/verification/:id/:hashedId", verifyCount);



module.exports = router;