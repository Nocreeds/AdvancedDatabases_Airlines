const express = require('express');
const app = express();
const path = require('path');
const mongof = require('./mongodb');
app.use(express.json());


app.use(express.static('web'));

const neo4j = require('neo4j-driver');
const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'admin';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

app.get('/nodes', async (req, res) => {
    const session = driver.session();
    const ses = await session.run("MATCH (n) Return n ");
    res.send(ses);
})
// booking at certain time of a day (Monday - Morning time during a whole week)

app.post('/query', async (req, res) => {
    const {weekName} = req.body; 
    const session = driver.session();
    const fet=await session.run(`MATCH (week:WEEK) -[:HAS_DAYS] -> (days:DAYS)
     WHERE (week.name = '${weekName}') return (SUM(days.Morning_booking) / 4)`);
    console.log(fet.records[0]);
    const reply = fet.records[0]._fields[0].low;
    res.json(reply);
})

//for a particular day for a whole month 
app.post('/query2', async (req, res) => {
   const {day} = req.body;
   const session = driver.session();
   const var1 = await session.run(`Match (d:DAYS) where (d.dayofweek = '${day}') 
   return ((SUM(d.Morning_booking + d.Night_booking + d.Noon_booking + d.Evening_booking))/4)`)
   console.log(var1.records[0]);
   const reply = var1.records[0]._fields[0].low;
   res.json(reply);
})

app.post('/query3', async (req, res) => {
    const {t} = req.body;
    const session = driver.session();
    const var2 = await session.run(`Match (d:DAYS) WITH  SUM(d.Morning_booking) as m, 
    SUM(d.Noon_booking) as n, SUM(d.Evening_booking) as e, SUM(d.Night_booking) as g 
    UNWIND[m,n,e,g] as val return max(val)`)
    console.log(var2.records[0]);
    const reply = var2.records[0];
    res.json(reply);
 })

app.listen(3000);