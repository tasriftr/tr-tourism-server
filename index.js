const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5300;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tr tourism server ");
});

app.listen(port, () => {
  console.log(`running at http://localhost:${port}`);
});
