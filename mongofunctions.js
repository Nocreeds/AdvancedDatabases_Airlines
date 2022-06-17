const express = require('express')
const router = express.Router()
//const models = require('./models');
const url = 'mongodb://localhost:27017/Arrival'

var https = require('https');
var fs = require('fs');
const PORT = process.env.PORT || 27017
const bodyparser = require("body-parser");
const path = require('path');
const app = express();

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log("Connected...")
})

app.listen(4000, () => {
    console.log(`server started at http:localhost:${4000}`)
})

app.use(bodyparser.urlencoded({
    extended: false
}))
app.use(bodyparser.json())

const booksch={
    RegistrationNu:String,
    Time:String,
    CustomerName:String,
    PhoneNumber:Number,
    RefNumber:String
   }

const monmodel = mongoose.model("bookings",booksch);



app.get('/allbooking',(req,res)=> {
    monmodel.find({},function(err,bookings){
        res.render('book',{
            Allbookings:bookings
        })
    }) 
})