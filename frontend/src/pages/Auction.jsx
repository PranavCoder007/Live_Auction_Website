import React, { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';
import './Auction.css';
import './List';
import { Link, useNavigate } from 'react-router-dom';
import { FirstNameContext } from '../App';
const socket = io.connect('http://localhost:8000'); // Update with your backend URL

const AuctionRoom = () => {
  
  const navigate= useNavigate();
  const {roomCode,setRoomCode} = useContext(FirstNameContext);
  socket.emit('joinAuction',{roomcode:roomCode});
  const {firstName,setFirstName}=useContext(FirstNameContext);
  const [time, setTime] = useState(10); // Initial time
  const [currentBid, setCurrentBid] = useState(0); // Initial current bid
  const [currentBidder, setCurrentBidder] = useState(''); // Initial current bidder
  const [currentplayer, setCurrentPlayer]= useState([]);
  const [player, setPlayer] = useState();
  const [playerIndex, setPlayerIndex] = useState(-1); // Initialize player index
  const [timeout, setTimeout] = useState();
  const handleBid = () => {
    socket.emit("bid", {bidder:firstName,roomcode:roomCode}); 
    //reset karo timer ko and change current bidder and bid
  };
  useEffect(() => {
    // Listen for 'setbidder' event from server and update currentBid and currentBidder state
    const setBidderHandler = ({ currentBidder, currentBid }) => {
      setCurrentBid(currentBid);
      setCurrentBidder(currentBidder);
    };
  
    socket.on("setbidder", setBidderHandler);
  
    // Clean up event listener on component unmount
    return () => {
      socket.off("setbidder", setBidderHandler);
    };
  }, [setCurrentBid, setCurrentBidder]);

  const handleplayer = () => {
    socket.emit("players", {roomcode:roomCode});
  };
  const updateCurrentPlayer = (players) => {
    setPlayer(players[0]?.player_name || '');
  };
  const getPlayerHandler = ({players}) => {
    updateCurrentPlayer(players);
    socket.emit("time", { roomcode: roomCode });
    socket.on("display", displayTime);
  };
  
  useEffect(() => {
    const playerupdate = ({player}) => {
      setPlayer(player?.player_name || '77');
      console.log(player)
    };
    const displayTime = (data) => {
      setTime(data.time);
      console.log(data.time);
      if(data.time<=1){
        console.log("time is 0")
        socket.emit("next", { roomcode: roomCode });
        socket.on("player",playerupdate);
     } 
    };
    
    const gameOver = () => {
        navigate('/List');
    };
    socket.on("getplayer", getPlayerHandler);
    socket.on("display", displayTime);
    socket.on("game-over", gameOver);
     

    
     
    return () => {
      socket.off("getplayer", getPlayerHandler);
      socket.off("display", displayTime);
    };
  }, [setPlayer,setCurrentPlayer]);

  return (
    <div className="auction-room">
      <button className="start_Auction" onClick={() => handleplayer()}>Start Auction</button>
      <div className="header">
        <h1>IPL Auction Room</h1>
        <p>Current Player: {player}</p>
        <p>Current Bidder: {currentBidder}</p>
        <p>Current Bid: {currentBid} Cr</p>
        {/* {budgetError && <p className="error">{budgetError}</p>} */}
        <p>Time Left: {time} seconds</p>
      </div>
      <div className="actions">
        <button className="bid-btn" onClick={() => handleBid()}>Bid 1 Cr</button>
      </div>
      {/* Display player card
      {playerInfo && (
        <div className="player-card">
          <img src={playerInfo.playerImg} alt="Player" />
          <h3>{playerInfo.playerName}</h3>
          <p>Role: {playerInfo.role}</p>
          <p>Bid Amount: {playerInfo.bidAmount} Cr</p>
          <p>Extra Stats: {playerInfo.extraStats}</p>
        </div>
      )} */}
    </div>
  );
};

export default AuctionRoom;

