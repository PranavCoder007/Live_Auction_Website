const User = require("./user");
const dbUser = require("../database/models/user");
const Room = require("../database/models/auction");
class Auction {
  constructor(roomcode) {
    this.users = [];
    this.currentBidder = "";
    this.currentBid = 0;
    this.currentPlayer = "";
    this.timer = 10;
    this.interval = null;
    this.roomcode = roomcode;
    this.player = 0;
    this.confirm = 0;
    this.started = false;
    this.over =false;
    this.finalbidder='';
  }

  startAuction() {
    this.started = true;
  }

  getStatus() {
    return this.started;
  }

  bid(socket, bidder) {
    if (this.currentBidder === bidder) {
      return;
    }
    const user = this.findUser(bidder);

    if (user.budget <= this.currentBid + 1) {
      return socket.emit("bid-error", {
        message: "The current bid exceeds your budget.",
      });
    }
    this.currentBid += 1;
    this.currentBidder = bidder;
    this.resetTimer();
    this.roomcode.emit("setbidder", {
      currentBidder: this.currentBidder,
      currentBid: this.currentBid,
    });
    //console.log(this.currentBidder)
  }

  findUser(user) {
    const currentUser = this.users.find((u) => {
      return u.user === user;
    });
    return currentUser;
  }

  servePlayer(players) {
    console.log(players)
    console.log(this.player)
    const player = players[this.player];
    console.log(player)
    this.currentPlayer = player.player_name;
    this.roomcode.emit("player", {
      player,
    });
  }


  getCurrentPlayer() {
    return this.currentPlayer;
  }

  getCurrentBid() {
    const bidder = {
      bidder: this.currentBidder,
      bid: this.currentBid,
    };
    return bidder;
  }

  displayBidder() {
    const currentBidder = this.getCurrentBid();
    this.roomcode.emit("bid", {
      currentBidder,
    });
  }

  resetBid() {
    this.currentBidder = "";
    this.currentBid = 0;
    this.roomcode.emit("setbidder", {
      currentBidder: this.currentBidder,
      currentBid: this.currentBid,
    });
  }

  resetTimer() {
    this.timer = 10;
    this.confirm = 0;
  }

  clearTimer() {
    clearInterval(this.interval);
  }

  startInterval() {
    const currObj = this;
    this.interval = setInterval(() => {
      currObj.decrementClock();
    }, 2000);
  }

  async decrementClock() {
    if (this.timer <= 0) {
      if (this.currentBidder) {
        this.player++;
        console.log(this.player)
        this.addPlayer(this.currentPlayer, this.currentBidder);
        const {Players}=await (Room.findOne({roomcode: this.roomcode.rooms.values().next().value}));
        this.next(Players,this.roomcode)
      }
      this.clearTimer();
      this.resetBid();
      this.resetTimer();
      //console.log(this.timer);
    }
    const time = this.timer;
    const roomcode = this.roomcode;
    roomcode.emit("display", {
      time,
    });
    this.timer--;
  }

  gameOver(players) {
    //console.log(this.player);
    if (players.length === this.player) {
      const auction = this;
      this.setover();
      this.roomcode.emit("game-over");
      
      return true;
    }
    return false;
  }

  async setover(){
    const room = await Room.findOne({ roomcode: this.roomcode.rooms.values().next().value});
    this.over = true;
    await Room.findOneAndUpdate(
      { roomcode: this.roomcode.rooms.values().next().value },
      { done: true},
      { new: true }
    );
    console.log(room.done)
  }
  addUser(user) {
    if (!this.dupUser(user)) this.users.push(new User(user));
  }

  removeUser(user) {
    this.users = this.users.filter((u) => user !== u.user);
  }

  dupUser(user) {
    const dup = this.users.filter((u) => user === u.user);
    if (dup.length === 0) {
      return false;
    }
    return true;
  }

  next(players) {
    console.log("in next")
    console.log(players)
    this.confirm++;
    if (this.confirm >= this.users.length) {
      if (!this.gameOver(players)) {
        this.resetBid();
        this.resetTimer();
        this.startInterval();
        this.servePlayer(players);
      }
    }
  }

  // async addPlayer(player, amount) {
  //   const newRoom = await Room.findOne({ roomcode: formData.roomcode });
  //   const p = [...newRoom.Teams.players]
  //   const currentUser = this.findUser(this.currentBidder);
  //   Room.findOneAndUpdate({ roomcode: formData.roomcode})
  //   currentUser.addPlayer(player);
  //   currentUser.deduct(amount);
  //   this.confirm = 0;
  //   this.roomcode.emit("users", {
  //     users: this.users,
  //   });
  // }
  async addPlayer(player, amount) {
    try {
      //console.log("addplayers")
      const room = await Room.findOne({ roomcode: this.roomcode.rooms.values().next().value});
      //console.log("roomfound");
      if (!room) {
        throw new Error('Room not found');
      }
  
      const { Teams } = room;
      console.log(amount)
      const teamIndex = Teams.findIndex(team => team.captain === amount);

      if (teamIndex === -1) {
        throw new Error('Team with matching captain not found');
      }
  
      const updatedTeams = [...Teams];
      const team = updatedTeams[teamIndex];
      team.player_name.push(player);
      //console.log(updatedTeams);
      await Room.findOneAndUpdate(
        { roomcode: this.roomcode.rooms.values().next().value },
        { Teams: updatedTeams},
        { new: true }
      );
      // const room1 = await Room.findOne({ roomcode: this.roomcode.rooms.values().next().value});
      // console.log(room1.Teams)
      this.confirm = 0;
      this.roomcode.emit("users", { users: this.users });
    } catch (error) {
      console.error('Error adding player to team:', error);
    }
  }
  
  fetchPlayers() {
    return this.users;
  }
  sendme (socket, data) {
    console.log("in sendme")
    //console.log(data)
    this.currentPlayer=data[0].player_name;
    //console.log(this.currentPlayer)
    this.roomcode.emit("getplayer", { players: data });
  }
}

module.exports = Auction;