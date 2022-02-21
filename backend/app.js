require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan =  require('morgan');
const app = express();
const PORT = process.env.PORT || 3300;
const cookieParser = require("cookie-parser");
const session = require("express-session");

//
const userRouter = require("./routes/user");
const followRouter = require("./routes/followers");
const postRouter = require("./routes/post");
const homeRouter = require("./routes/home");

//db connection
mongoose.connect(process.env.DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
})
.then(()=> console.log("Database connected !"))
.catch(error => console.log(`Something went wrong: ${error.message}`));

//headers
app.use(cookieParser());
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use((req, res, next)=>{
    res.setHeader("Control-Allow-Access-Origin","*");
    res.setHeader("Control-Allow-Access-Methods","GET, PUT, UPDATE, PUT, PATCH, DELETE");
    res.setHeader("Control-Allow-Access-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, auth_token");
    next();
});

app.use(session({
    key : "user_session",
    secret: process.env.AUTH_SECRRET,
    resave: false,
    saveUninitialized: false,
}));


//routers
app.use("/api/user", userRouter);
app.use("/api/follow",followRouter);
app.use("/api/post", postRouter);
app.use("/api", homeRouter);

app.listen(PORT, ()=>{
    console.log(`Server linsten on ${PORT}`);
});