const {
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
} = require("../controller/game");

const Room=require('../database/models/auction')
const Auction = require("../controller/auction");

const socketRouter = (io) => {
  io.on("connection", (socket) => {
    socket.on("check-user", ({ user }) => {
      checkUser(socket, user);
    });

    socket.on("createAuction", (formData) => {
      create(io, socket, formData);
      // socket.emit("pariticpants",(socket));
    });

    socket.on("joinAuction", (data) => {
      join(io, socket, data);
      // socket.emit("pariticpants",(socket));
    });

    socket.on("requestPlay", (data) => {
      start(io, data);
    });

    socket.on("start", (data) => {
      play(data);
    });

    socket.on("bid", (data) => {
      bid(socket, data);
    });
    socket.on("players", (data) => {
      sendme(socket, data);
    });
    socket.on("time",(data) => {
      time(socket, data);
    })
    socket.on("next", (data) => {
      next(io, data);
    });

    socket.on("server-users", ({ room }) => {
      serverUsers(io, room);
    });

    socket.on("exit", (data) => {
      exitUser(io, data);
    });
  });
};

module.exports = socketRouter;