const express = require("express");
const User = require("../controller/user");
const router = express.Router();
const { auth } = require("../middleware/auth");
const Room =require("../database/models/auction")

router.get('/SearchAuctions',async(req,res)=>{
  try{
    const auctions = await Room.find()
    res.json(auctions);
  }
  catch(err){
    console.log(err)
    res.status(500).json({message:err.message})
  }
})


// router.get("/Played-auctions",  async (req, res) => {
//   res.status(200).send({
//     success: true,
//     message: "Fetched Users",
//     players: User.players,
//   });
// });
router.get("/Played-auctions/:roomcode", async (req, res) => {
  const { roomcode } = req.params;
  try {
    const room = await Room.findOne({ roomcode: roomcode });
    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    const { Teams } = room;
    res.status(200).json({ success: true, message: "Fetched teams", teams: Teams });
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
