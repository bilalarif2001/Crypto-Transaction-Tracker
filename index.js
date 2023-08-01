const express = require("express");
require ('dotenv').config(); // For using enviornment variables
const app = express();

const dbConnection= require ('./config/connection') //connection to MongoDB

const addressRouter = require ('./routes/address.controller')
const watcher= require("./functions/watcher") // Address watcher for transaction

app.use(express.json()) // for accept Post request data of body
app.use(express.urlencoded({ extended:true }));

dbConnection() // connecting to MongoDB

// Watching addresses for transactions in latest block every 5 seconds.
watcher()



app.use("/address", addressRouter); // using address router
const port = process.env.PORT;
app.listen(port, () => console.log("App is listening at port"+ port));
