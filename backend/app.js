require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3300;
const cookieParser = require("cookie-parser");
const session = require("express-session");

//
const userRouter = require("./routes/user");
const followRouter = require("./routes/followers");
//db connection
mongoose.connect(process.env.DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
})
.then(()=> console.log("Database connected !"))
.catch(error => console.log(`Something went wrong: ${error.message}`));

//headers
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use((req, res, next)=>{
    res.setHeader("Control-Allow-Access-Origin","*");
    res.setHeader("Control-Allow-Access-Methods","GET, PUT, UPDATE, PUT, PATCH, DELETE");
    res.setHeader("Control-Allow-Access-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    next();
});
app.use(session({
    key: "user_sid",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:false,
    cookie:{
        expires: 360000
    }
}))

app.get("/set-cookie",(req, res)=>{
    res.cookie("foo", "bar",{
        //maxAge: 5000,
        expires: new Date("15 February 2022")
    });
    res.send("cookie was set to foo");
})

app.get("/get-cookie", (req, res)=>{
    console.log(req.cookies.name);
    res.send(req.cookies);
})

app.get("/del-cook", (req, res)=>{
    res.clearCookie("name");
    res.status(200).json({message: "Cookie was deleted"});
})

//routers
app.use("/api/user", userRouter);
app.use("/api",followRouter);

app.listen(PORT, ()=>{
    console.log(`Server linsten on ${PORT}`);
});