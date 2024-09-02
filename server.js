const express = require("express")
require("dotenv").config();
const Router = require("./routes")

const app = express();
app.use(express.json());
app.use("/api/v3/app" , Router);

app.get('/',(req,res) => {
    res.json({mssg : "Welcome to my App"});
})
app.listen(process.env.PORT,() => {
    console.log(`Server Running at port : ${process.env.PORT}`);
})