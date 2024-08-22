// src/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  const [fromUserId, toUserId] = location.state || [1, 1]; // Use fallback values if location.state is undefined

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws/${fromUserId}/${toUserId}`);
    setWs(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    fetch(`http://localhost:8080/message/${fromUserId}/${toUserId}`)
      .then(response => response.json())
      .then(data => setMessages(data));

    return () => socket.close();
  }, [fromUserId, toUserId]);

  useEffect(() => {
    // Scroll to the bottom when a new message arrives
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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

    fetch(`http://localhost:8080/message`, {
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
    <div style={styles.chatContainer}>
      <h1>Messages between User {fromUserId} and User {toUserId}</h1>
      <div style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={
              message.from_user === fromUserId ? styles.senderMessageContainer : styles.receiverMessageContainer
            }
          >
            <div
              style={
                message.from_user === fromUserId ? styles.senderMessage : styles.receiverMessage
              }
            >
              {message.detail}
              <img
                src={`https://i.pravatar.cc/40?u=${message.from_user}`} // Avatar based on user ID
                alt="avatar"
                style={message.from_user === fromUserId ? styles.senderAvatar : styles.receiverAvatar}
              />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button style={styles.sendButton} onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    padding: '20px',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    // backgroundColor: '#f1f1f1',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: '#556B2F',
  },
  senderMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10px',
  },
  receiverMessageContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: '10px',
  },
  senderMessage: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    display: 'flex',
    alignItems: 'center',
  },
  receiverMessage: {
    backgroundColor: '#e5e5e5',
    color: 'black',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    wordWrap: 'break-word',
    display: 'flex',
    alignItems: 'center',
  },
  senderAvatar: {
    marginLeft: '10px',
    borderRadius: '50%',
  },
  receiverAvatar: {
    marginRight: '10px',
    borderRadius: '50%',
  },
  inputContainer: {
    display: 'flex',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  sendButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Chat;
