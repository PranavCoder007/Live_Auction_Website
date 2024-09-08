const Room=require('../database/models/auction')
const Auction = require("./auction");
const liveAuctions = new Map();

const create = async (io, socket, formData) => {
  try
  {
    console.log(typeof formData.roomcode)
    const existingRoom = await Room.findOne({ roomcode: formData.roomcode });
    if (existingRoom) {
      // If room exists, emit an error and return early
      socket.emit('error', { status: 400, message: 'Room already exists' });
      return;
    }
    await Room.create(formData);
    const newRoom = await Room.findOne({ roomcode: formData.roomcode });
    console.log(typeof newRoom.roomcode)
    socket.join(newRoom.roomcode);
    const auction = new Auction(io.to(newRoom.roomcode));
    liveAuctions.set(newRoom.roomcode, auction);
    // //console.log(auction);
    // //console.log(liveAuctions);
    for (let i = 0; i < newRoom.Teams.length; i++) {
      const { team_name, captain } = newRoom.Teams[i];
      auction.addUser(captain);
      //console.log(captain);
    }
    
    io.to(newRoom.roomcode).emit("users", {
      users: auction.users,
    });
  }
  catch(error)
  {
    //console.error('Error creating room:', error);
    socket.emit('error', { status: 500, message: 'Internal Server Error' });
  }
};

// const addp = async (roomcode,player,bidder) => {
//   const room = await Room.findOne({ roomcode: roomcode });
//       if (!room) {
//         throw new Error('Room not found');
//       }
  
//       const { Teams } = room;
//       const teamIndex = Teams.findIndex(team => team.captain === bidder);
//       if (teamIndex === -1) {
//         throw new Error('Team with matching captain not found');
//       }
  
//       const updatedTeams = [...Teams];
//       const team = updatedTeams[teamIndex];
//       console.log(team)
//       team.players.push({ player_name: player });
//       console.log(updatedTeams.players);
//       await Room.findOneAndUpdate(
//         { roomcode: roomcode },
//         { Teams: updatedTeams },
//         { new: true }
//       );
// }
// Called while joining a game
const join = (io, socket, data) => {
  const auction = liveAuctions.get(data.roomcode);
  if (!auction) {
    // //console.log()
    return socket.emit("join-result", {
      success: false,
      error: "Room does not exist!!",
    });
  }
  socket.join(data.roomcode);
  socket.emit("join-result", {
    success: true,
    roomcode: data.roomcode,
    error: "",
  });
  io.to(data.roomcode).emit("users", {
    users: auction.users,
  });
};

const start = (io, data) => {
  io.to(data.roomcode).emit("start");
};

const play = (data) => {
  const auction = liveAuctions.get(data.roomcode);
  const {Players}=(Room.findOne(data.roomcode));
  
  auction.startAuction();
  auction.servePlayer(Players);
  auction.startInterval();
};

const bid = (socket, data) => {
  const auction = liveAuctions.get(data.roomcode);
  // //console.log(liveAuctions)
  // //console.log(data.roomcode)
  //console.log(auction)
  auction.bid(socket, data.bidder);
  auction.displayBidder();
  //console.log(auction)
};
const sendme = async (socket, data) => {
  const auction = liveAuctions.get(data.roomcode);
  const room= await Room.findOne({roomcode: data.roomcode});
  auction.sendme(socket,room.Players);
};
const time=(socket,data)=>{
  const auction = liveAuctions.get(data.roomcode);
  auction.startInterval();
};
const next = async (io, data) => {
  const auction = liveAuctions.get(data.roomcode);
  const {Players}=await (Room.findOne({roomcode: data.roomcode}));
  //console.log(Players)
  auction.next(Players, auction, data.roomcode);
};

const checkUser = (socket, user) => {
  let toBeFound;
  let roomcode;

  for (let [key, value] of liveAuctions) {
    const find = value.findUser(user.username);
    if (find) {
      toBeFound = find;
      roomcode = key;
      break;
    }
  }

  if (toBeFound) {
    socket.join(roomcode);
    socket.emit("existing-user", {
      roomcode: roomcode,
      users: liveAuctions.get(roomcode).fetchPlayers(),
      initial: liveAuctions.get(roomcode).getCurrentPlayer(),
      started: liveAuctions.get(roomcode).getStatus(),
    });
  } else {
    socket.emit("no-existing-user");
  }
};

const serverUsers = (io, roomcode) => {
  const auction = liveAuctions.get(roomcode);
  if (!auction) {
    return;
  }
  io.to(roomcode).emit("users", {
    users: auction.users,
  });
};

const exitUser = (io, data) => {
  const auction = liveAuctions.get(data.roomcode);
  auction.removeUser(data.user);
  if (auction.users.length === 0) {
    liveAuctions.delete(data.roomcode);
  }
  serverUsers(io, data.roomcode);
};

module.exports = {
  create,
  join,
  start,
  play,
  bid,
  next,
  checkUser,
  serverUsers,
  exitUser,
  sendme,
  time,
};