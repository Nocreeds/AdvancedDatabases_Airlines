const mongoURI = 'mongodb+srv://read:a123456@cluster0.3ju38.mongodb.net/?retryWrites=true&w=majority';
// const mongoURI = 'mongodb://localhost:27017';
const { MongoClient } = require('mongodb');
const { timeout } = require('nodemon/lib/config');
const client = new MongoClient(mongoURI);
// const app = express();
// app.use(express.json());
// app.use(express.static('www'));

async function readdata(){
    await client.connect();
    const db = client.db('airline');
    const coll = db.collection('master');
    const locations = await coll.find({}).toArray();
    console.log(locations);
    }
readdata();
// app.listen(3000)