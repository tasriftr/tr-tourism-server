const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5300;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@test.mqwonpn.mongodb.net/?retryWrites=true&w=majority&appName=test`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    const spotCollection = client.db("coffeeDB").collection("spot");
    const countryCollection = client.db("coffeeDB").collection("country");
    app.get("/spot", async (req, res) => {
      try {
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch spots" });
      }
    });

    app.post("/spot", async (req, res) => {
      try {
        const newSpot = req.body;
        const result = await spotCollection.insertOne(newSpot);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to add spot" });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
// done
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Tr tourism server ");
});

app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
