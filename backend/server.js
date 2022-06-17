const mongoose = require("mongoose");
const StateModel = require("./models/States");
const cors = require("cors");
const port = process.env.PORT | 3001;
const express = require('express');
const app = express();
const RedisClient = require('redis').createClient();


mongoose.connect("mongodb+srv://read:a123456@cluster0.3ju38.mongodb.net/airline");

app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.send('hello world')
  })


app.get("/getOne", async (req, res)=>{
    console.log("getting One loc")
    StateModel.findOne({},'lat lon', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

app.get("/getAll", async (req, res)=>{
    console.log("getting all loc")
    StateModel.find({},'lat lon', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
});

app.get("/getAllLimit", async (req, res)=>{
    console.log("getting all loc")
    StateModel.aggregate(
        [
            {"$group": { "_id": { icao24: "$icao24", lat: "$lat", lon: "$lon" } } }
        ]
    , (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }).limit(10);
});

app.get("/getAllLimit20", async (req, res)=>{
    console.log("getting all loc")
    StateModel.find({},'lat lon', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }).limit(20);
});

app.get("/getTestIcaoSinglePlane", async (req, res)=>{
    console.log(req.query.timeStamp);
    StateModel.find({'icao24' : "a5669f", 'time' : req.query.timeStamp},'lat lon time velocity heading lastcontact', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }).limit(20);
});

app.get("/getAllAirplanesByTime", async (req, res)=>{
    const timeStamp = req.query.timeStamp;
    console.log(timeStamp);
    StateModel.aggregate(
        [
            { "$match": { "time": {$eq: timeStamp } } },
            { "$group": { "_id": { icao24: "$icao24", lat: "$lat", lon: "$lon", time:"$time", velocity:"$velocity", heading:"$heading" } } }
        ]
    , (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }).limit(10);
});

app.get("/getSelectedPlanesByTime", async (req, res)=>{
    const timeStamp = req.query.timeStamp;
    console.log(timeStamp);
    StateModel.find(
        { $or: 
            [ 
                { icao24: "a5669f"}, 
                { icao24: "a51738"}, 
                { icao24: "ac75a5"}, 
                { icao24: "4d0021"},
                { icao24: "ace2a7"},
                { icao24: "e48799"},
                { icao24: "aa2bc1"},
                { icao24: "151daa"},
                { icao24: "a6cc45"},
                { icao24: "ac7b1b"},
                { icao24: "7380cb"},
                { icao24: "c0174d"},
                { icao24: "71be17"},
                { icao24: "aad249"},
                { icao24: "aaf4bd"},
            ],
            $and:
            [
                {time: timeStamp}
            ]
        }, 
    'icao24 lat lon time velocity heading lastcontact', (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    }).limit(20).sort({icao24: 1});
});


StateModel.findOne({},'lat lon', (err, result) => {
    if(err) {
        console.log(err);
    } else {
        console.log(result);
    }
});



async function redisStore() {
    await RedisClient.connect();
    // await RedisClient.set(`pos${i}`,data);
    RedisClient.disconnect();
    console.log(`Connected to redis!!`);
    // i++;
}

// redisStore();

app.listen(port, ()=> {
    console.log("Running...",port);
});
