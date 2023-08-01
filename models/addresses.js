const mongoose= require ("mongoose")

const addressSchema = new mongoose.Schema({
 address:{
    type:String,
    required:true,
 },
 transactions:{
   type:Array
 }

})

const Address=mongoose.model("address",addressSchema)
module.exports=Address