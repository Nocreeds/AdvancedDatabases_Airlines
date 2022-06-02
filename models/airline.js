
const { Int32, number } = require("mongodb");
const mongoose = require("mongoose");

const schema = mongoose.Schema;

let master = new schema({

    _id:schema.Types.ObjectId,
    time:number,
    icao24:String,
    lat:number,
    lon:number,
    velocity:number,
    heading:number,
    vertrate:number,
    callsign:String,
    onground:String,
    alert:String,
    spi:String,
    squawk:number,
    baroaltitude:number,
    geoaltitude:number,
    lastposupdate:number,
    lastcontact:number


    
},{
    timestamps:true
})


module.exports = mongoose.model("master",master);