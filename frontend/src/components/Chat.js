// src/Chat.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useWebSocket from 'react-websocket';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  console.log(location.state);
  const [ fromUserId, toUserId ] = location.state || [1,1];

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/${fromUserId}/${toUserId}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    fetch(`http://localhost:8080/message/${fromUserId}/${toUserId}`)
      .then(response => response.json())
      .then(data => setMessages(data));

    return () => socket.close();
  }, [fromUserId, toUserId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      from_user: fromUserId,
      to_user: toUserId,
      detail: newMessage,
    };

    if (ws) {
      ws.send(JSON.stringify(message));
    }

    fetch('http://localhost:8080/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })
      .then(response => response.json())
      .then(data => {
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage('');
      });
  };

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
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
