
// import React, { useState, useEffect, useContext } from 'react';
// import './List.css';
// import io from 'socket.io-client';
// import { FirstNameContext } from '../App';

// const TeamListAfterAuction = () => {
//   const [playerTeams, setPlayerTeams] = useState([]);
//   const { roomCode } = useContext(FirstNameContext);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/Played-auctions/${roomCode}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             // Add any authorization headers if needed
//           },
//         });
//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }
//         const data = await response.json();
//         console.log(data.teams)
//         setPlayerTeams(data.teams);
//         // Assuming the response contains an array of teams
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     setTimeout(() => {
//     if (roomCode) {
//       fetchData();
//     }
//   }, 5000);
//   }, [roomCode]);
//   useEffect(() => {
//     console.log(playerTeams); // Log updated state
//   }, [playerTeams]);
//   return (
//     <div className="team-list-after-auction">
//       <h1>Player-Team Associations</h1>
//       <div className="player-team-list">
//         {playerTeams.map((team, index) => (
//           <div key={index} className="player-team-item">
//             <span className="team-name">{team.team_name}</span>
//             <span className="captain">{team.captain}</span>
//             {/* Render other team details as needed */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeamListAfterAuction;

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './List.css';
import io from 'socket.io-client';
import { FirstNameContext } from '../App';
import  './Afterlogin';

const TeamListAfterAuction = () => {
  const [playerTeams, setPlayerTeams] = useState([]);
  const { roomCode } = useContext(FirstNameContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/Played-auctions/${roomCode}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any authorization headers if needed
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPlayerTeams(data.teams);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    setTimeout(() => {
         if (roomCode) {
           fetchData();
         }
       }, 1000);

  }, [roomCode]);

  useEffect(() => {
    console.log(playerTeams); // Log updated state
  }, [playerTeams]);

  return (
    <div className="team-list-after-auction">
      <h1>Player-Team Associations</h1>
      <div className="player-team-list">
        {playerTeams.map((team, index) => (
          <div key={index} className="player-team-item">
            <span className="team-name">{team.team_name}</span>
            <span className="captain">{team.captain}</span>
            <div className="player-names">
              <h3>Players:</h3>
              <ul>
                {team.player_name.map((player, playerIndex) => (
                  <li key={playerIndex}>{player}</li>
                ))}
              </ul>
            </div>
            {/* Render other team details as needed */}
          </div>
        ))}
      </div>
      <Link to="/Afterlogin">
        <button>Return</button>
      </Link>
    </div>
  );
};

export default TeamListAfterAuction;