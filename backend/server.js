const express = require("express");
const app = express();
const mongoose = require("mongoose");
const StateModel = require("./models/States");
const cors = require("cors");

app.use(express.json);
app.use(cors());
mongoose.connect("mongodb+srv://read:a123456@cluster0.3ju38.mongodb.net/airline");


app.get("/getLoc", (req, res)=>{
    console.log("getting all loc")
    StateModel.findOne({},'lat lon', (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});


StateModel.findOne({},'lat lon', (err, result) => {
    if(err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
app.listen(3001, ()=> {
    console.log("Running...");
});