const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );
const mongoose = require("mongoose");
const StateModel = require("./models/States");
const AircraftModel = require("./models/Aircraft");
const cors = require("cors");
const responseTime = require('response-time')
const port = process.env.PORT | 3001;
const express = require('express');
const app = express();
const redis = require('ioredis');
const { promisify } = require('util');
const client = redis.createClient({
    host: 'redis-10218.c293.eu-central-1-1.ec2.cloud.redislabs.com',
    port:10218,
    password:'90u5qq2DBYMJYg39UNgmo2SysVlvgZk7' 
});
const neo4j = require('neo4j-driver')
const uri = 'neo4j+s://aa24b15a.databases.neo4j.io';
const user = 'neo4j';
const password = 'KnbA0NOVLkyQ79Ix5-L-PsurbbuzjEJj42KyLidunYU';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
const session = driver.session()

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
const GET_ASYNC = promisify(client.get).bind(client)
const SET_ASYNC = promisify(client.set).bind(client)

mongoose.connect("mongodb+srv://write:a123456@cluster0.3ju38.mongodb.net/airline");

app.use(cors());
app.use(express.json());
app.use(responseTime());


app.get('/', async (req, res) => {
    res.send('hello world')
  })
app.get('/Aircraft/:id', async(req,res)=>{
    console.log("getting One Aircraft")
    let state = await StateModel.findOne({icao24: req.params.id},'time lat lon',).exec();
    AircraftModel.findOne({icao24: req.params.id},'model owner manufacturername engines reguntil', async (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if(state != null){
            try {

                const result = await session.run(
                    `MERGE (a1:Aircraft { icao24: $id})

                    MERGE (s1:State { time: $time, lat:$lat , lon:$lon })

                    MERGE (a1)-[:Warning{severity: $severity}]->(s1)`,
                  { id: req.params.id, time: state.time , lat: state.lat, lon:state.lon, severity:getRandomInt(4) }
                )
              
                console.log(node.properties.name)
              } finally {
                await session.close()
              }}
            res.json(result);
        }
    });

})

app.get('/live', async (req, res) => {
      try {
        const reply = await GET_ASYNC('live')
        if (reply) {
          console.log('using cached data')
          res.send(JSON.parse(reply))
          return
        }
        var url = 'https://opensky-network.org/api/states/all'; //Include the protocol here (https://)
        $.when($.getJSON(url)).done(function(data) {

/*             $.each(data.states, function(i, value) {
                StateModel.collection.insertOne({
                    time : value[3],
                    icao24 : value[0],
                    lat : value[6],
                    lon : value[5],
                    velocity : value[9],
                    heading : value[10],
                    vertrate : value[11],
                    callsign :  value[1],
                    onground :value[8],
                    alert : value[15],
                    spi : value[15],
                    squawk : value[14],
                    baroaltitude : value[7],
                    geoaltitude : value[13],
                    lastposupdate : value[4],
                    lastcontact :value[4],
                })
            }); */
            const saveResult = SET_ASYNC(
                'live',
                JSON.stringify(data.states),
                'EX',
                59
              )
              console.log('new data cached', saveResult)
            res.json(data.states);
         })
      } catch (error) {
        res.send(error.message)
      }

})


app.get("/getOne", async (req, res)=>{
    console.log("getting One loc")
    StateModel.findOne({},'time vertrate', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

app.get("/getAll", async (req, res)=>{
    try {
        const reply = await GET_ASYNC('states')
        if (reply) {
          console.log('using cached data')
          res.send(JSON.parse(reply))
          return
        }
        console.log("getting all loc")
        StateModel.find({},'time icao24 vertrate').limit(1000).exec(async (err, respone) => {
            if (err) {
                console.log(err);
            } else {
                const saveResult = SET_ASYNC(
                    'states',
                    JSON.stringify(respone),
                    'EX',
                    10
                  )
                  console.log('new data cached', saveResult)
                  res.json(respone)
            }
        });
      } catch (error) {
        res.send(error.message)
      }
});

//MongoDB test
StateModel.findOne({},'vertrate', (err, result) => {
    if(err) {
        console.log(err);
    } else {
        console.log(result);
    }
});
// redis test
const runApplication = async () => {

    const setAsync = promisify(client.set).bind(client);
    const getAsync = promisify(client.get).bind(client);

    await setAsync('foo', 'bar');
    const fooValue = await getAsync('foo');
    console.log(fooValue);
};

client.on('connect', ()=> {
    console.log("Reddis connected")
})

runApplication();

app.listen(port, ()=> {
    console.log("Running...",port);
});
