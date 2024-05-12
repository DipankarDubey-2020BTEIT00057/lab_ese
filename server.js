const express = require("express");
const mongoose = require("mongoose");
const app = require("./App");

const username = "Customer_detail";
const password = "Customer_detail_123";
const database_name = "Customer";
//connect database
//const DBuri = `mongodb+srv://${username}:${password}@nodepractice.bpsc6bg.mongodb.net/${database_name}?retryWrites=true&w=majority`;
const db = `mongodb://${username}:${password}@ac-j3im6lj-shard-00-00.bpsc6bg.mongodb.net:27017,ac-j3im6lj-shard-00-01.bpsc6bg.mongodb.net:27017,ac-j3im6lj-shard-00-02.bpsc6bg.mongodb.net:27017/${database_name}?ssl=true&replicaSet=atlas-ymw7xh-shard-0&authSource=admin&retryWrites=true&w=majority`;

//require("dotenv").config();

mongoose
  .connect(db)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = app.listen(3000, () => {
  console.log("Connected");
});
