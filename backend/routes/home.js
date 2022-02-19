const { authVerification } = require('../controllers/userController');

const router = require('express').Router();

router.get("/home",authVerification,(req, res)=>{
    console.log(`User ${req.userId} logged in home Page`);
    res.status(200).json({message: "Welcome to the home page"});
})


module.exports = router;