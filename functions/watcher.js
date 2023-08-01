require ('dotenv').config(); // For enviorment variables
const {ethers} = require("ethers")
const jsonRpcUrl= process.env.JSON_RPC_URL // API key for JSON rpc provider
const provider= new ethers.providers.JsonRpcProvider(jsonRpcUrl)

const identifyTransactionTypeAndPush= require("./IdentifyTransactionAndPush")

// Watches Transactions
function watcher(){

    // Event that sends blocknumber whenver a new block appears on Ether explorer
    provider.on("block",(latestBlockNumber)=>{
        console.log("current Block Number",latestBlockNumber)
    identifyTransactionTypeAndPush(latestBlockNumber)

    })
}

module.exports=watcher