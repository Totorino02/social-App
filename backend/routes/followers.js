const follow = require("../controllers/followersController");

const router = require("express").Router();

router.get("/follow/:uId/:fId", follow);


module.exports = router;
