import React, { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './Search.css';
import './Bidder'
import './List'
import { FirstNameContext } from '../App';
import io from 'socket.io-client'
import { Link, useNavigate } from 'react-router-dom';

const socket = io("http://localhost:8000");

const AuctionSearch = () => {
    const navigate= useNavigate();
    const {roomCode,setRoomCode} = useContext(FirstNameContext);
    const [roomcode, setRoomcode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [auctions, setAuctions] = useState([]);
    
    const handleCardClick = (auction) => {
        setSelectedAuction(auction);
    };

    const fetchAuctions = async () => {
        try {
            const url = "http://localhost:8000/SearchAuctions";
            const response = await axios.get(url);
            setAuctions(response.data)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => { 
        fetchAuctions();
    }, []);

    // Mapping function to map fetched auctions
    const handleRoomcodeSubmit = () => {
        // Check if room code matches the selected auction's room code
        if (selectedAuction && roomcode === selectedAuction.roomcode && !selectedAuction.done) {
            // Redirect to auction page or perform other actions
            console.log(selectedAuction);
            setRoomCode(selectedAuction.roomcode);
            alert('Room code matched! Redirecting...');
            socket.emit('joinAuction',{roomcode:selectedAuction.roomcode});
            navigate(`/Bidder/${selectedAuction._id}`);
        }
        else if (selectedAuction && roomcode === selectedAuction.roomcode && selectedAuction.done) {
            setRoomCode(selectedAuction.roomcode);
            alert('Auciton is done! Redirecting...');
            navigate('/List');

        }
        else {
            alert('Incorrect room code!');
        }
    };


    const filteredAuctions = auctions.filter(auction =>
        auction.Auction_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='fade-in'>
        <div className="auction-search-container">
            <h1>Auction Search</h1>
            <input
                type="text"
                placeholder="Search for an auction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredAuctions.map((auction, index) => (
                <div key={index} className="auction-card" onClick={() => handleCardClick(auction)}>
                    {auction.Auction_Name}
                </div>
            ))}
            {selectedAuction && (
                <div>
                    <input
                        type="text"
                        className="room-code-input"
                        placeholder="Enter room code"
                        value={roomcode}
                        onChange={(e) => setRoomcode(e.target.value)}
                    />
                    <button onClick={handleRoomcodeSubmit}>Enter Auction</button>
                    <button onClick={() => setSelectedAuction(null)}>Cancel</button>
                </div>
            )}
        </div>
        </div>
    );
}

export default AuctionSearch;

    