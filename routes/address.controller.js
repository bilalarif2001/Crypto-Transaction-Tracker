require("dotenv").config(); // using enviorment Variables

const express = require("express");
const addressSchema = require("../models/addresses"); // AddressDB schema
const router = express.Router(); // using Express router


// Checking if user exists in address database
async function findAddressinDB(address){
  let findAddressinDB = await addressSchema.findOne({ address: address.toLowerCase()}); // Gets out filtered data with given address
  if (findAddressinDB) return true
  else return false

}

// API endpoint for taking addresses to watch
router.post("/addAddress", async (req, res) => {
  let { address } = req.body;

let checkAddress = await findAddressinDB(address)  // checking if user already exists

if (checkAddress)
    res.status(403).send({ message: "Address already exists in database" });
  else {
    // If user does not exist in database, then add address into DB.
    let user = {
      address: address.toLowerCase(),
    };
    const newUser = new addressSchema(user);
    await newUser.save(); // Saving data into address database
    res.status(200).send({ message: "success" });
  }
})

router.get("/viewAddressTransactions/:address", async (req, res) => {
  let {address}=req.params
  let result = await addressSchema.findOne({ address: address.toLowerCase()}) // finding address from DB

  if(result) res.status(200).send({transactions:result.transactions}) // If address exists in database, return transactions
  else res.status(404).send({message:"Address is invalid or address does not exist in database"})


})

module.exports = router;
