const jsonRpcUrl= process.env.JSON_RPC_URL
const {ethers} = require("ethers")
const provider= new ethers.providers.JsonRpcProvider(jsonRpcUrl)
const addressSchema = require("../models/addresses");

async function filterSenderAddressInBlock(blockNumber){
    try {
        const addressesToWatch= await addressSchema.find() // Get addresses from database

        const latestBlock= await provider.getBlockWithTransactions(blockNumber) // Sends latest block details with transactions
        let latestBlockTransactions=latestBlock.transactions // transactions of latest block
    
        // This code below checks if the block includes the transaction performed by any one of the addresses from database.
        // It allows to indentify address transaction exists in the given block.
        let checkIfBlockIncludesSenderAddress= latestBlockTransactions.filter(transaction=>{// looping through transactions of latest block
            // Pushing elements into array whenever the from transaction includes address from database.
            return addressesToWatch.find(addressObj=>{
                return transaction.from.toLowerCase()===addressObj.address
            })
        })
        if (checkIfBlockIncludesSenderAddress.length>0) return checkIfBlockIncludesSenderAddress;
        else return false;
        
    } catch (error) {
        console.log(error)
    }
    
}

module.exports=filterSenderAddressInBlock