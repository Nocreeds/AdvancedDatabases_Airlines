const express = require('express');
const axios = require('axios');
const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
// const { mongo } = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const { json } = require('express/lib/response');
const app = express();
const RedisClient = require('redis').createClient();
const client = new MongoClient(mongoURI);

const airlat=50.1109;
const airlon = 8.6821;
const unit = "K";
app.use(express.json());
let i=0;


async function fetchData(t,icao) {
    var lat;
    var lon;
    var vel;
//3c6444
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
    //   console.log(JSON.stringify(response.data.states[0][5]),JSON.stringify(response.data.states[0][6]),JSON.stringify(response.data.states[0][0]));
      lat=JSON.stringify(response.data.states[0][5]);
      lon=JSON.stringify(response.data.states[0][6]);
      vel =JSON.stringify(response.data.states[0][9])
      var arrival = arrivalTime(lat,lon,airlat,airlon,unit,vel*3.6)
      redisStore(arrival); 
      console.log("arrivalTime  "+arrival);
    })
    .catch(function (error) {
      console.log(error);
    });

 
    
}
var time= 1458565000;

    function getdata(){
        
        var ic= "3c6444";
     
        time=time-10;
        console.log("time"+time);
        fetchData(time,ic);

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
        console.log("distance:  "+dist);
        var time = dist/velocity;
        return time;
    }
}



async function redisStore(data) {
    await RedisClient.connect();
    await RedisClient.set(`pos${i}`,data);
    RedisClient.disconnect();
    console.log(`pos${i} Data written`);
    i++;
}

async function mongoWriteData(data){
    var time=data;
    await client.connect();
    const db = client.db('ArrivalTime_tracking');
    const coll = db.collection('ArrivalTime');
    const locations = await coll.insertOne({arrival:time});
    }


    async function storeToMongo() {
        await RedisClient.connect();
        // const reply = await RedisClient.get('pos0');
        // const data = JSON.parse(reply);
        const posStack = [];
        const response = await RedisClient.keys('*');
            for (let x = 0; x < response.length; x++) {
                const position = JSON.parse(await RedisClient.get(`pos${x}`));
                console.log(`position${x} = Arrival: ${position}`);
                posStack.push(position)
            }
            posStack.forEach((data)=>{
                mongoWriteData(data)
                console.log("arrivalTime"+data);
            })
    
    
      RedisClient.disconnect();
       
    }


setInterval(getdata, 1200);


setInterval(storeToMongo, 30000);





app.listen(3000)