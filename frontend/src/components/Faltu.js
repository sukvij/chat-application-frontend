// src/Chat.js
import React, { useState, useEffect } from "react";
import useWebSocket from 'react-websocket';

const Faltu = ({ userID }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receiverID, setReceiverID] = useState("");

  const socketUrl = `ws://localhost:8080/ws?id=${userID}`;
  const { sendMessage, lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const receivedMessage = JSON.parse(lastMessage.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    const msg = { from: userID, to: receiverID, message };
    sendMessage(JSON.stringify(msg));
    setMessages((prevMessages) => [...prevMessages, msg]);
    setMessage("");
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.from}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={receiverID}
        onChange={(e) => setReceiverID(e.target.value)}
        placeholder="Receiver ID"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Faltu;
