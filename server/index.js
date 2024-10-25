const express = require("express");

const app = express();
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const rule = require("./routes/rules");
var cors = require('cors')

const port = process.env.PORT;
const connectDB = require("./config/db");
connectDB();
app.use(cors())
app.use(bodyParser.json());

app.use("/", rule);

// Start the Server

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
