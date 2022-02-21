const follow = require("../controllers/followersController");
const { authVerification } = require("../controllers/userController");

const router = require("express").Router();

router.get("/:fId", authVerification, follow);


module.exports = router;
