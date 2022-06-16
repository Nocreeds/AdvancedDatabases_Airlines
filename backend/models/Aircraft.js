const mongoose = require("mongoose");

const AircraftSchema = new mongoose.Schema({
    icao24 : String,
    registration : String,
    manufacturericao : String,
    manufacturername : String,
    model : String,
    typecode : String,
    serialnumber : String,
    linenumber :  String,
    icaoaircrafttype :String,
    operator : String,
    operatorcallsign : String,
    operatoricao : String,
    operatoriata : String,
    owner : String,
    testreg : Date,
    registered : Date,
    reguntil: Date,
    status: String,
    built: Date,
    firstflightdate: Date,
    seatconfiguration: String,
    engines: String,
    modes : Boolean,
    adsb: Boolean,
    acars: Boolean,
    notes: String,
    categoryDescription: String,
});

const AircraftModel = mongoose.model("Aircraft", AircraftSchema , "Aircraft");

module.exports = AircraftModel