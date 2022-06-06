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

module.exports = StateModel