const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ermhfxw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const flightCollection = client.db('FTDB').collection('flights');

        app.get('/flights', async (req, res) => {
            const cursor = flightCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/flights/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query)
            const result = await flightCollection.findOne(query);
            res.send(result);
        });

        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("FT Booking Server successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('FT Booking Server Is Running');
});

app.listen(port, () => {
    console.log(`FT Booking Server Is Running on Port ${port}`);
});