const express = require('express');
const axios = require('axios');
const RedisClient = require('redis').createClient();
let i = 0;

const app = express();
app.use(express.json());
app.use(express.static('www'));
async function fetchData() {
    const reply = await axios.get('https://opensky-network.org/api/states/all');
    const data = JSON.stringify(reply.data.states);
    console.log(data.length);
    // redisStore(data); 
}

// async function redisStore(data) {
//     await RedisClient.connect();
//     await RedisClient.set(`pos${i}`, data);
//     RedisClient.disconnect();
//     console.log(`Data written`);
//     i++;
// }
setInterval(fetchData, 1200);
app.listen(5000);