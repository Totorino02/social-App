const { register, verifyCount, login } = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verification/:id/:hashedId", verifyCount);



module.exports = router;