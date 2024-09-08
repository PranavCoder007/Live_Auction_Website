import React, { useState,useEffect,useContext } from 'react';
import './Forms.css';
import './Auction'
import { FirstNameContext } from '../App';
import axios from 'axios'
import io from 'socket.io-client'
import { Link, useNavigate } from 'react-router-dom';

const socket = io("http://localhost:8000");

const AuctionPlayersForm = () => {
    const navigate= useNavigate();
    const {roomCode,setRoomCode} = useContext(FirstNameContext);
    const [Players, setPlayers] = useState([]);
    const [Teams, setTeams] = useState([]);
    const [Auction_Name, setAuction_Name] = useState('');
    const [roomcode, setroomcode] = useState('');
    const [auctions,setAuctions] = useState([]);
    const addPlayer = () => {
        setPlayers([...Players, { player_name: '', role: '', bid_amount: '', extra_stats: '' }]);
    };

    const addTeam = () => {
        setTeams([...Teams, { team_name: '', captain: '' }]);
    };

    const handlePlayerChange = (index, field, value) => {
        const newPlayers = [...Players];
        newPlayers[index][field] = value;
        setPlayers(newPlayers);
    };

    const handleTeamChange = (index, field, value) => {
        const newTeams = [...Teams];
        newTeams[index][field] = value;
        setTeams(newTeams);
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            Auction_Name,
            Players,
            Teams,
            roomcode
        };
        try {
            socket.emit('createAuction', formData);
            setRoomCode(formData.roomcode);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    
    const fetchAuctions = async () => {
        try {
            const url = "http://localhost:8000/SearchAuctions";
            const response = await axios.get(url);
            setAuctions(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(()=>{
        fetchAuctions();

    },[auctions]);
    const handleNavigate = () => {
        // Check if room code matches the selected auction's room code
        const selectedAuction = auctions.find((auction) => auction.roomcode === roomcode);
        console.log(selectedAuction);
        // console.log(roomCode);
        alert('Room code matched! Redirecting...');
        navigate(`/Auction/${selectedAuction._id}`);
    };
    return (
        <div className="auction-form-container">
            <h1>Auction Players & Teams Form</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Players section */}
                <div className="Players-container">
                    <h2>Players</h2>
                    {Players.map((player, index) => (
                        <div key={index} className="player">
                            <label>Player Name:</label>
                            <input type="text" value={player.player_name} onChange={(e) => handlePlayerChange(index, 'player_name', e.target.value)} required />

                            {/* Player Type Radio Buttons */}
                            <div className="player-type-label">
                                <label>
                                    <input type="radio" value="batsman" checked={player.role === 'batsman'} onChange={() => handlePlayerChange(index, 'role', 'batsman')} required />
                                    Batsman
                                </label>
                                <label>
                                    <input type="radio" value="bowler" checked={player.role === 'bowler'} onChange={() => handlePlayerChange(index, 'role', 'bowler')} required />
                                    Bowler
                                </label>
                                <label>
                                    <input type="radio" value="allrounder" checked={player.role === 'allrounder'} onChange={() => handlePlayerChange(index, 'role', 'allrounder')} required />
                                    All Rounder
                                </label>
                            </div>

                            <label>Bid Amount:</label>
                            <input type="number" value={player.bid_amount} onChange={(e) => handlePlayerChange(index, 'bid_amount', e.target.value)} required />
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addPlayer}>
                        Add Player
                    </button>
                </div>

                {/* Teams section */}
                <div className="Teams-container">
                    <h2>Teams</h2>
                    {Teams.map((team, index) => (
                        <div key={index} className="team">
                            <label>Team Name:</label>
                            <input type="text" value={team.team_name} onChange={(e) => handleTeamChange(index, 'team_name', e.target.value)} required />

                            <label>Captain:</label>
                            <input type="text" value={team.captain} onChange={(e) => handleTeamChange(index, 'captain', e.target.value)} required />
                        </div>
                    ))}
                    <button type="button" className="add-btn" onClick={addTeam}>
                        Add Team
                    </button>
                </div>
                
                <label>Auction Name:</label>
                <input type="text" name="Auction_Name" value={Auction_Name} onChange={(e) => setAuction_Name(e.target.value)} required />
                <label>Room Code:</label>
                <input type="text" name="roomcode" value={roomcode} onChange={(e) => setroomcode(e.target.value)} required />

                <div className="button-container">
                    <input type="submit" className="submit-btn" value="Submit" />
                </div>    
                
            </form>
            <div className="button-container">
                <button className="submit-btn" onClick={handleNavigate}>To Auction</button>
            </div>
        </div>
    );
};

export default AuctionPlayersForm;

// import React, { useState,useEffect,useContext } from 'react';
// import './Forms.css';
// import './Auction'
// import { FirstNameContext } from '../App';
// import axios from 'axios'
// import io from 'socket.io-client'
// import { Link, useNavigate } from 'react-router-dom';

// const socket = io("http://localhost:8000");

// const AuctionPlayersForm = () => {
//     const navigate= useNavigate();
//     const {roomCode,setRoomCode} = useContext(FirstNameContext);
//     const [Players, setPlayers] = useState([]);
//     const [Teams, setTeams] = useState([]);
//     const [Auction_Name, setAuction_Name] = useState('');
//     const [roomcode, setroomcode] = useState('');
//     const [auctions,setAuctions] = useState([]);
//     const addPlayer = () => {
//         setPlayers([...Players, { player_name: '', role: '', bid_amount: '', extra_stats: '' }]);
//     };

//     const addTeam = () => {
//         setTeams([...Teams, { team_name: '', captain: '' }]);
//     };

//     const handlePlayerChange = (index, field, value) => {
//         const newPlayers = [...Players];
//         newPlayers[index][field] = value;
//         setPlayers(newPlayers);
//     };

//     const handleTeamChange = (index, field, value) => {
//         const newTeams = [...Teams];
//         newTeams[index][field] = value;
//         setTeams(newTeams);
//     };
    

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const formData = {
//             Auction_Name,
//             Players,
//             Teams,
//             roomcode
//         };
//         try {
//             socket.emit('createAuction', formData);
//             setRoomCode(formData.roomcode);
//         } catch (error) {
//             console.error('Error submitting form:', error);
//         }
//     };

    
//     const fetchAuctions = async () => {
//         try {
//             const url = "http://localhost:8000/SearchAuctions";
//             const response = await axios.get(url);
//             setAuctions(response.data);
//         } catch (error) {
//             console.log(error);
//         }
//     };
//     // useEffect(()=>{
//         fetchAuctions();

//     // },[]);
//     const handleNavigate = () => {
//         // Check if room code matches the selected auction's room code
//         const selectedAuction = auctions.find((auction) => auction.roomcode === roomcode);
//         console.log(selectedAuction);
//         // console.log(roomCode);
//         alert('Room code matched! Redirecting...');
//         navigate(`/Auction/${selectedAuction._id}`);
//     };
//     return (
//         <div className="auction-form-container">
//             <h1>Auction Players & Teams Form</h1>
//             <form onSubmit={handleSubmit} encType="multipart/form-data">
//                 {/* Players section */}
//                 <div className="Players-container">
//                     <h2>Players</h2>
//                     {Players.map((player, index) => (
//                         <div key={index} className="player">
//                             <label>Player Name:</label>
//                             <input type="text" value={player.player_name} onChange={(e) => handlePlayerChange(index, 'player_name', e.target.value)} required />

//                             {/* Player Type Radio Buttons */}
//                             <div className="player-type-label">
//                                 <label>
//                                     <input type="radio" value="batsman" checked={player.role === 'batsman'} onChange={() => handlePlayerChange(index, 'role', 'batsman')} required />
//                                     Batsman
//                                 </label>
//                                 <label>
//                                     <input type="radio" value="bowler" checked={player.role === 'bowler'} onChange={() => handlePlayerChange(index, 'role', 'bowler')} required />
//                                     Bowler
//                                 </label>
//                                 <label>
//                                     <input type="radio" value="allrounder" checked={player.role === 'allrounder'} onChange={() => handlePlayerChange(index, 'role', 'allrounder')} required />
//                                     All Rounder
//                                 </label>
//                             </div>

//                             <label>Bid Amount:</label>
//                             <input type="number" value={player.bid_amount} onChange={(e) => handlePlayerChange(index, 'bid_amount', e.target.value)} required />
//                         </div>
//                     ))}
//                     <button type="button" className="add-btn" onClick={addPlayer}>
//                         Add Player
//                     </button>
//                 </div>

//                 {/* Teams section */}
//                 <div className="Teams-container">
//                     <h2>Teams</h2>
//                     {Teams.map((team, index) => (
//                         <div key={index} className="team">
//                             <label>Team Name:</label>
//                             <input type="text" value={team.team_name} onChange={(e) => handleTeamChange(index, 'team_name', e.target.value)} required />

//                             <label>Captain:</label>
//                             <input type="text" value={team.captain} onChange={(e) => handleTeamChange(index, 'captain', e.target.value)} required />
//                         </div>
//                     ))}
//                     <button type="button" className="add-btn" onClick={addTeam}>
//                         Add Team
//                     </button>
//                 </div>
                
//                 <label>Auction Name:</label>
//                 <input type="text" name="Auction_Name" value={Auction_Name} onChange={(e) => setAuction_Name(e.target.value)} required />
//                 <label>Room Code:</label>
//                 <input type="text" name="roomcode" value={roomcode} onChange={(e) => setroomcode(e.target.value)} required />

//                 <div className="button-container">
//                     <input type="submit" className="submit-btn" value="Submit" />
//                 </div>    
                
//             </form>
//             <div className="button-container">
//                 <button className="submit-btn" onClick={handleNavigate}>To Auction</button>
//             </div>
//         </div>
//     );
// };

// export default AuctionPlayersForm;