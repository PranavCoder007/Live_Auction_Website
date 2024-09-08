const mongoose=require('mongoose')
const {Schema}=mongoose
const auctionRoomSchema=new Schema({
    Auction_Name:{
        type:String,
        required:true,
        trim:true
    },
    Players:[
        {
            // captain:{
            //     type:String,
            //     trim:true
            // },
            player_name:{
                type:String,
                required:true,
                trim:true
            },
            role:{
                type:String,
                enum:{
                    values:["batsman","bowler","allrounder","wicketkeeper"],
                    message:'{VALUE} is not supported'
                },
                default:"allrounder"
            },
            bid_amount:{
                type:Number,
                required:true,
            },
            player_img:{
                data:Buffer,
                contentType:String,
            },
            extra_stats:{
                type:String,
                trim:true,
                maxlength:20,
            },
        },
    ],
    Teams:[
        {
            team_name:{
                type:String,
                required:true,
                trim:true
            },
            captain:{
                type:String,
                required:true,
                trim:true
            },
            player_name:{
                    type:Array,
                    trim:true
            }
        }
    ],
    roomcode:{
        type:String,
        required:true,
    },
    done:{
        type:Boolean,
        default:false
    }
})
const Room=mongoose.model("Room",auctionRoomSchema);
module.exports=Room;