const axios= require ("axios") // using axios Request

// Sends transaction message to Slack channel.
async function sendSlackMessage(transaction){
    try {
        const {from,transactionType,blockNumber,transactionHash}= transaction
            // using Slack markdown payload structure
        const payload=  {
                "blocks": [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `*address* ${from} performed ${transactionType} based transaction :moneybag: on *block number* _${blockNumber}_ *transaction hash:* <https://goerli.etherscan.io/tx/${transactionHash}>`
                        }
                    },
                ]
            }
        
        // Pushing notifications
         await axios.post("https://hooks.slack.com/services/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",payload)
    } catch (error) {
        console.log(error)
    }
}

module.exports=sendSlackMessage