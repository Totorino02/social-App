const { authVerification } = require('../controllers/userController');

const router = require('express').Router();

router.get("/home",authVerification,(req, res)=>{
    res.status(200).json({message: "Welcome to the home page"});
})


module.exports = router;