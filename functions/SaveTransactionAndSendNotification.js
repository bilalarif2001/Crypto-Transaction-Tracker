const addressSchema = require("../models/addresses"); // DB address schema
const sendSlackMessage= require("./SendSlackMessage") // for sending messages

async function saveTransactionAndSendNotification(from,hash,transactionData){
    try {
        // checking DB via sender address of transaction
        let addressDetails= await addressSchema.findOne({address:from.toLowerCase()})
        // if address exists then check if transaction is already pushed to the database to prevent duplicates.
        if (addressDetails){
          let addressTransactions=addressDetails.transactions
          let checkIfTransactionAlreadyExists= addressTransactions.find(tx=>{
              if (tx.transactionHash===hash) return true 
              else return false
          })
          // checks if transaction already exists in database against address 
          if (!checkIfTransactionAlreadyExists){
            // in case if doesnt exist, then push transaction to db and send slack notification.
               await addressSchema.findOneAndUpdate({address:from.toLowerCase()},{$push:{transactions:transactionData}})

               await sendSlackMessage(transactionData)
              }

              else {
                  console.log("Transaction already Exists in Database")
              }
        }
    } catch (error) {
      console.log(error)  
    }
   
}

module.exports= saveTransactionAndSendNotification;