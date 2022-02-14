const { register, verifyCount } = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);

router.get("/verification/:id/:hashedId", verifyCount);



module.exports = router;