const express = require('express');
const axios = require('axios');
const { timeout } = require('nodemon/lib/config');
const { stringify } = require('nodemon/lib/utils');
const { json } = require('express/lib/response');
const app = express();
const RedisClient = require('redis').createClient();


const airlat=50.1109;
const airlon = 8.6821;
const unit = "K";
app.use(express.json());
let i=0;
let k=0;
var ic= "3c65c6";
var arr_est=1655232900;

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
      lat=JSON.stringify(response.data.states[0][5]);
      lon=JSON.stringify(response.data.states[0][6]);
      vel =JSON.stringify(response.data.states[0][9])
      var arrival = arrivalTime(lat,lon,airlat,airlon,unit,vel*3.6)
      redisStore(arrival); 
    })
    .catch(function (error) {
      //console.log(error);
    });

   

    
    
}
var time= 1655229723;

    function getdata(){
        
        var ic= "3c65c6";
     
        time=time-10;
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
        var time = dist/velocity;
        return time;
    }
}



async function redisStore(data) {
    await RedisClient.connect();
    await RedisClient.set(`pos${i}`,data);
    var a=await RedisClient.get(`pos${i}`);
    RedisClient.disconnect();
    console.log(`pos${i} Data written`);
    console.log(a);

    i++;
    console.log(a);
    var b = 1655256120 - 1655232929;
    if(b > 0 ){
            console.log("Delay");
        }
        else {
            console.log("Flight on Time");
        }
   
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
            // console.log(position);
            posStack.push(position)
        }
        posStack.forEach((data)=>{
            mongoWriteData(data)
            // console.log(data);
        })
    
      RedisClient.disconnect();
        }
setInterval(getdata, 1200);
setInterval(storeToMongo, 10000);
app.listen(3000)