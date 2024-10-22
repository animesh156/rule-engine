const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT;
const colors = require("colors");
const ruleRoute = require("./routes/rules");
const connectDB = require("./config/db");

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", ruleRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}.`.yellow);
});
