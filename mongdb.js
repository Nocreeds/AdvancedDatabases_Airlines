const express = require('express');
const axios = require('axios');

const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
// const { mongo } = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const { json } = require('express/lib/response');
const app = express();
app.use(express.static('www'));
const mongoURI = 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI);



const airlat=50.1109;
const airlon = 8.6821;
const unit = "K";
app.use(express.json());
let i=0;
var k=0;

async function fetchData(t,icao) {
    var lat;
    var lon;
    var vel;
   

    var config = {
      method: 'get',
      url: `https://opensky-network.org/api/states/all?time=${t}&icao24=${icao}`,
      headers: { 
        'Authorization': 'Basic RkFIOnNEcWJTaTQ3TWdSWkd3bSE=', 
        'Cookie': 'XSRF-TOKEN=20f4e405-ceca-49da-87cd-ead964d0994f'
      }
    };
  


    axios(config)
    .then(function (response) {
    
      lat=JSON.stringify(response.data.states[0][5]);
      lon=JSON.stringify(response.data.states[0][6]);
      vel =JSON.stringify(response.data.states[0][9])
      var arrival = arrivalTime(lat,lon,airlat,airlon,unit,vel*3.6)
      var result = JSON.stringify({"arrivalTime":`${arrival}`,"lat":`${lat}`,"lon":`${lon}`,"icao":`${icao}`});
        var result2 = JSON.parse(result);
        console.log(result2);
        
        k++;
        return result2;
        
  
    })
    .catch(function (error) {
        console.log(error);
    });

 
    
}
var time= 1458565000;

    function getdata(name, t){
        
        var ic= '3c6444';
     
        time=time-10;
       // console.log("time"+time);
        fetchData(time,ic);
        k++;
        console.log(k);
    }



function arrivalTime(lat1, lon1, lat2, lon2, unit,velocity) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        var time = dist/velocity;
        return time;
    }
}

async function mongoWriteData(data){
    var time=data;
    await client.connect();
    const db = client.db('Arrival');
    const coll = db.collection('arrivalTime');
    const locations = await coll.insertOne({arrival:time});
    }

async function mongoPush(){
   
}
    app.listen(4000);
