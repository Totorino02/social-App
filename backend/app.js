require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;

//
const userRouter = require("./routes/user");

//db connection
mongoose.connect(process.env.DB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
})
.then(()=> console.log("Database connected !"))
.catch(error => console.log(`Something went wrong: ${error.message}`));

//headers

app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use((req, res, next)=>{
    res.setHeader("Control-Allow-Access-Origin","*");
    res.setHeader("Control-Allow-Access-Methods","GET, PUT, UPDATE, PUT, PATCH, DELETE");
    res.setHeader("Control-Allow-Access-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    next();
});

//routers
app.use("/api/user", userRouter);

app.listen(PORT, ()=>{
    console.log(`Server linsten on ${PORT}`);
});