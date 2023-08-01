const axios= require ("axios") // using axios Request
require("dotenv"). config()

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
        const slackApi= process.env.SLACK_WEB_API
         await axios.post(slackApi,payload)
    } catch (error) {
        console.log(error)
    }
}

module.exports=sendSlackMessage