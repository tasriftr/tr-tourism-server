const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5300;

// middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://tr-tourism.web.app"], // Remove trailing slashes
  })
);
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
    const userCollection = client.db("coffeeDB").collection("user");
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

    app.get("/spot/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch spot details" });
      }
    });

    app.put("/spot/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateSpot = req.body;
        const spot = {
          $set: {
            name: updateSpot.name,
            country: updateSpot.country,
            location: updateSpot.location,
            average_cost: updateSpot.average_cost,
            short_description: updateSpot.short_description,
            seasonality: updateSpot.seasonality,
            totalVisitorsPerYear: updateSpot.totalVisitorsPerYear,
            travel_time: updateSpot.travel_time,
          },
        };
        const result = await spotCollection.updateOne(filter, spot, options);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to update spot" });
      }
    });

    app.delete("/spot/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to delete spot" });
      }
    });

    app.get("/country", async (req, res) => {
      try {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch countries" });
      }
    });

    app.get("/country/:country_name", async (req, res) => {
      try {
        const country_name = req.params.country_name;
        const query = { country: country_name };
        const cursor = spotCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch spots for country" });
      }
    });

    app.get("/mylist/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;
        const query = { email: userId };
        const cursor = spotCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch user's list" });
      }
    });
    app.get("/season/:seasonId", async (req, res) => {
      try {
        const seasonId = req.params.seasonId;
        const query = { seasonality: seasonId };
        const cursor = spotCollection.find(query);
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch user's list" });
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tr tourism server ");
});

app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
