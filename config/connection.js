const mongoose= require('mongoose'); 


// Connecting to MongoDB
async function dbConnection (){
try {
    const connect= await mongoose.connect(process.env.URI);
    console.log(`DB-Connection-Host: ${connect.connection.host} \nDB-Name: ${connect.connection.name}`);
    console.log("MongoDB atlas connected")
} catch (error) {
    console.log("MongoDB Server error:"+ error)
}

}

module.exports = dbConnection;