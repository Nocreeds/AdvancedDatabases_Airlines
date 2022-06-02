const express = require('express');
const axios = require('axios');
const airPlaneInfo= require('./airPlaneInfo');

var planeIcon = L.icon({
    iconUrl: 'plane.png',
    shadowUrl: 'plane_shadow.png',

    iconSize:     [30, 30], // size of the icon
    shadowSize:   [35, 35], // size of the shadow
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    shadowAnchor: [12, 5],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var marker = L.marker([51.5, -0.09], {icon: planeIcon}).addTo(map);

// setTimeout(() => {
//     console.log("Hello");
//     var latlng = L.latLng(51.501, -0.09);
//     marker.setLatLng(latlng);
// }, 2000)


// setInterval(() => {
//     var latlng = marker.getLatLng();
//     latlng.lat += 0.0001;
//     latlng.lng += 0.0001;
//     marker.setLatLng(latlng);
// }, 16);

const mongoURI = 'mongodb+srv://read:a123456@cluster0.3ju38.mongodb.net/?retryWrites=true&w=majority';
// const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
const client = new MongoClient(mongoURI);
const app = express();
app.use(express.json());
app.use(express.static('www'));

async function readdata(){
    await client.connect();
    const db = client.db('airline');
    const coll = db.collection('master');
    const locations = await coll.find({}).toArray();
    console.log(locations);
    }
readdata();
app.listen(3000)

