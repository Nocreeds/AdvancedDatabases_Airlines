// var map = L.map('map').setView([51.505, -0.09], 13);

// var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);

// var marker = L.marker([51.5, -0.09]).addTo(map);

const express = require('express');
const axios = require('axios');
const airPlaneInfo= require('./airPlaneInfo');




// const RedisClient = require('redis').createClient();
// let i = 0;

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

