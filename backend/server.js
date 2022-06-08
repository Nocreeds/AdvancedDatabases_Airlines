const mongoose = require("mongoose");
const StateModel = require("./models/States");
const cors = require("cors");
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

//MongoDB test
StateModel.findOne({},'lat lon', (err, result) => {
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
