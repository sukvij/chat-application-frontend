// src/HomePage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Add CSS file for styling

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="homepage-container">
      <h1>Welcome to Our Application</h1>
      <button onClick={handleLogin} className="homepage-button">Login</button>
      <button onClick={handleSignup} className="homepage-button">Signup</button>
    </div>
  );
};

export default Home;
