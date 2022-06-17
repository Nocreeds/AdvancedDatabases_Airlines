const express = require('express');
const axios = require('axios');
const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
// const { mongo } = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const { json } = require('express/lib/response');
const app = express();
app.use(express.static('www'));
const RedisClient = require('redis').createClient();
const client = new MongoClient(mongoURI);

const airlat=39;
const airlon = 35;
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
        .then(function (response)
        {
      lat=JSON.stringify(response.data.states[0][5]);
      lon=JSON.stringify(response.data.states[0][6]);
      vel =JSON.stringify(response.data.states[0][9])
        var arrival = GetRemainingTimeOfArrival(lat,lon,airlat,airlon,vel*3.6)
            var result = JSON.stringify({ "timeToReachDestination": `${arrival}`, "lat": `${lat}`, "lon": `${lon}`, "icao": `${icao}`, "velocity": `${vel}`});
        var result2 = JSON.parse(result);
        console.log(result2);
        redisStore(result2); 
        
        return result2;
       
     
    
    })
    .catch(function (error) {
    });

 
    
}

fetchData(1655412449, 'a21b74');

function GetRemainingTimeOfArrival(latitudeOfAirplane, longitudeOfAirplane, latitudeDestination, longitudeDestination, speedOfAirplane)
{
    if ((latitudeOfAirplane === latitudeDestination) && (longitudeOfAirplane === longitudeDestination))
    {
        return 0;
    }
    else
    {
        var totalDistance = getDistanceFromLatLonInKm(latitudeOfAirplane, longitudeOfAirplane, latitudeDestination, longitudeDestination);
        var time = totalDistance / speedOfAirplane;
        //console.log(totalDistance);
        return time;
    }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)
{
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg)
{
    return deg * (Math.PI / 180)
}




app.get('/arrTime', async (req, res) => {
    await RedisClient.connect();
    const posStack = [];
    let len = 0;
    
    
    
    const response = await RedisClient.keys('*');
    len = response.length;
    for (let x = 0; x < response.length; x++) {
        const position = JSON.parse(await RedisClient.get(`pos${x}`))
        posStack.push(position);
    }



    res.json({time:posStack[k].arrivalTime,lat:posStack[k].lat,lon:posStack[k].lon,icao:posStack[k].icao});


    RedisClient.disconnect();
  
    setInterval(incrK,7000);

       

}
)








app.listen(3000)




