const mongoose=require('mongoose')
const {schema}=mongoose
const auctionSchema=new schema({
    player_name:{
        type:String,
        required:true,
        trim:true
    },
    team_name:{
        type:String,
        required:true,
        trim:true
    },
    bid_amount:{
        type:Number,
        required:true,
    }
})
module.exports=mongoose.model("auction-updates",auctionSchema)