const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
    time : Number,
    icao24 : String,
    lat : Number,
    lon : Number,
    velocity : Number,
    heading : Number,
    vertrate : Number,
    callsign :  String,
    onground :String,
    alert : String,
    spi : String,
    squawk : Number,
    baroaltitude : Number,
    geoaltitude : Number,
    lastposupdate : Number,
    lastcontact :Number,
});

const StateModel = mongoose.model("master", StateSchema , "master");
const unique = async()=>{
    try{
    await StateModel.collection.createIndex({time:1, icao24: 1} , {unique:true});
}
catch(err){
    console.log("no write access")
}}
unique();


module.exports = StateModel