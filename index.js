const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
try {
  const conn = mongoose.connect(process.env.DATABASE_URL);
  console.log('MongoDB Connected');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
require("./V1/model");

app.use(require("./V1/router"));
  
app.listen(process.env.APP_PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.APP_PORT}`);
}); 