const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
require("dotenv").config();
const cors = require('cors');

const port = process.env.PORT || 5000;


//middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('Salam Bistro Boss from server')
})

app.listen(port, () =>{
    console.log(`Alhamdulillah Bistro Bosst On Port ${port}`)
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.bhtyeej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

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


const menuCollection = client.db('bistroBossDB').collection('menu');
const reviewsCollection = client.db('bistroBossDB').collection('reviews');
const cartsCollection = client.db('bistroBossDB').collection('carts');


//get all menu

app.get('/menu', async(req, res) =>{
    const result = await menuCollection.find().toArray();
    res.send(result);
})

//get all reviews

app.get('/reviews', async(req, res) =>{
    const result = await reviewsCollection.find().toArray();
    res.send(result);
})

//send cart to db
app.post('/carts', async(req, res) =>{
  const cartItem = req.body;
  const result = await cartsCollection.insertOne(cartItem);
  res.send(result);
})

//get all carts
app.get('/carts', async(req, res) =>{
 const email = req.query.email;
 const query = {email: email}
  const result = await cartsCollection.find(query).toArray();
  res.send(result);
})


//delete added carts

app.delete('/carts/:id' , async(req, res) =>{
  const id = req.params.id;
 
  const query = {_id : new ObjectId (id)}
  const result = await cartsCollection.deleteOne(query);
  
  res.send(result);
})













    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
