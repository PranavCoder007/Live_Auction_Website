import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ParticipantsList = () => {
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    // Replace 'http://localhost:3000' with your socket server URL
    const socket = io('http://localhost:8000');

    // Subscribe to 'participants' event from the socket server
    socket.on('participants', (data) => {
      setParticipants(data);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>Participants Connected</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>{participant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;