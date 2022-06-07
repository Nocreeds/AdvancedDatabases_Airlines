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

redisStore();

app.listen(port, ()=> {
    console.log("Running...",port);
});
