const express = require("express");
const cookieParser = require("cookie-parser");
const cors =require("cors");
const helmet=require("helmet");
const morgan=require("morgan");
const socketio = require("socket.io");
// const http = require("http");
const userRouter = require("./routes/user.route");
const auctionRouter = require("./routes/auction.route");

const path = require("path");
require("dotenv").config();
const connectDB=require("./database/connection");

const app = express();
// const server = http.createServer(app);


connectDB(process.env.MONGO_URL)
const io = socketio(app.listen(process.env.PORT || 8000), {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});


//Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());

//Routes
app.use(userRouter);
app.use(auctionRouter);


if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

require("./routes/socket.route")(io);

console.log("Listening on port 8000");
// const io = socketio(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });


// //Middleware
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use(helmet({ contentSecurityPolicy: false }));
// app.use(morgan("dev"));
// app.use(express.json());

// //Routes
// app.use(userRouter);
// app.use(auctionRouter);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("frontend/my-react-app"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "my-react-app", "index.html"));
//   });
// }

// require("./routes/socket.route")(io);

// server.listen(process.env.PORT || 8000, () => {
//   console.log("Listening on port 8000");
// });
