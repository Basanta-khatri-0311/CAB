const express = require('express')
const cors = require('cors')


const app = express()

//middlewares
app.use(cors()) //for cross origin access
app.use(express.json()) //for allowing the json type


// Test Route
app.get("/", (req, res) => {
  res.send("COB Backend Running");
});

module.exports = app