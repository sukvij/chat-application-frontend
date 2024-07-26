// import React from 'react';
// import { useParams } from 'react-router-dom';

// const Chat = () => {
//   const { userId } = useParams();

//   return (
//     <div>
//       <h2>Profile Page</h2>
//       <p>Welcome, user with ID: {userId}</p>
//     </div>
//   );
// };

// export default Chat;

// src/ChatBox.js

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const Chat = ({ fromUserId, toUserId }) => {
    const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();

  console.log(location.state);

  // Destructure the state to get x and y
  const [x, y] = location.state || [null, null]; // Provide default values to avoid errors

  // Assign fromUserId and toUserId
  fromUserId = x;
  toUserId = y;

  console.log(fromUserId, toUserId);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      from_user: fromUserId, // Replace with the actual user ID
      to_user: toUserId,   // Replace with the actual user ID
      detail: newMessage,
    };

    if (ws) {
        ws.send(message);
      }

    try {
      await fetch('http://localhost:8080/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      }); 
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/${fromUserId}`);
    console.log(socket)
    setWs(socket);
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:8080/message/${fromUserId}/${toUserId}`);
        const data = await response.json();
        setMessages(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
    // return () => socket.close();
  }, [fromUserId, toUserId]);

  
  return (
    <div>
      <h1>Messages between User {fromUserId} and User {toUserId}</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <strong>{message.from_user} to {message.to_user}:</strong> {message.detail}
          </li>
        ))}
      </ul>
      <div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      </div>
    </div>
  );
};

export default Chat;
