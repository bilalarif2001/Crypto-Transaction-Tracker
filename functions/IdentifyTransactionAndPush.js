const {ethers} = require("ethers") // Ethers js library

require ('dotenv').config(); // For enviorment variables
const jsonRpcUrl= process.env.JSON_RPC_URL // API key for JSON rpc provider
const provider= new ethers.providers.JsonRpcProvider(jsonRpcUrl)

const filterSenderAddressInBlock= require("./FilterSenderAddresInBlock") // Retrives if transaction of address from address watchlist exists in latest block.

// Function to push transaction in DB and send slack notification
const saveTransactionAndSendNotification= require("./SaveTransactionAndSendNotification")

// Function to identify if transaction is of ERC 20 token or ETH token. And pushes the transaction to DB via using the save transaction and notification function
async function identifyTransactionTypeAndPush(blockNumber){
    try {
        let checkTransactions= await filterSenderAddressInBlock(blockNumber) // Getting transactions and addresses from latest block performed by watchlist address
 
        // If transactions of addresses exist in block
        if (checkTransactions){
            // Retrieve Transaction hashes
            const senderTransactionHashes= checkTransactions.map(transaction=>{
                return transaction.hash;
            })
            // Get transaction receipt of every transaction hashes from array
         senderTransactionHashes.forEach(async tx=>{
            let transactionReceipt= await provider.getTransactionReceipt(tx)

            // Checking if transaction receipt has logs, which identifies if the transaction is ERC 20 token based.
            if (transactionReceipt.logs.length>0){
                // Topics has 3 indexes, 0 for contract event, 1 for from address and 2 for to address.
                 if (transactionReceipt.logs[0].topics.length===3){
                    console.log ("Its an ERC-20 Based transaction")
                 let {from,logs,transactionHash,blockNumber,effectiveGasPrice}= transactionReceipt
                 let toAddress= logs[0].topics[2] // to address of transaction
        
                 // Has extra zeros at start, converting to hex and then back to number removes zeros.
                 let formatedToAddressHex= ethers.BigNumber.from(toAddress).toHexString()
                 let formattedValue= ethers.BigNumber.from(logs[0].data).toString()
                 // formatting gas price in number in wei
                 let formatedGasPrice= ethers.BigNumber.from(effectiveGasPrice._hex).toString()
                 let transactionData={
                    transactionType:"ERC-20 token",
                    from: from,
                    to:formatedToAddressHex,
                    contractAddress:logs[0].address,
                    transactionHash:transactionHash,
                    blockNumber:blockNumber,
                    gasPrice:ethers.utils.formatUnits(formatedGasPrice,"gwei"),
                    value:ethers.utils.formatEther(formattedValue) // Converting value from wei to ether
                 }

                 // Saving transaction to DB and sending notification
                 await saveTransactionAndSendNotification(from,transactionHash,transactionData)
                 }
            }
            else {
                // If logs are empty, then the transaction is ETH transaction
                console.log("Its a normal ETH transaction")
    
                let getTransaction= await provider.getTransaction(tx) // getting transaction receipts of all transaction hashes of watchlist addresses from block
                // console.log(getTransaction)
                let {from,to,hash,blockNumber,gasPrice,value}= getTransaction
                // Converting gas price from hex to wei
                let formatedGasPrice= ethers.BigNumber.from(gasPrice._hex).toString()
                // converting eth value from hex to wei
                let formattedValue= ethers.BigNumber.from(value).toString()
                let transactionData={
                    transactionType:"ETH",
                    from: from,
                    to:to,
                    contractAddress:null,
                    transactionHash:hash,
                    blockNumber:blockNumber,
                    gasPrice:ethers.utils.formatUnits(formatedGasPrice,"gwei"), // converting from wei to Gwei
                    value:ethers.utils.formatEther(formattedValue) // Converting value from wei to ether
                 }
                 // Saving transaction to DB and sending notification
                  await saveTransactionAndSendNotification(from,hash,transactionData)
                  }
            
        })
        }
    
        else if (checkTransactions===false) console.log("no transaction by watchlist addresses in current block")
        else console.log("Some error occured in filtering the data.")
    } catch (error) {
        console.log(error)
    }
   
}





module.exports=identifyTransactionTypeAndPush;