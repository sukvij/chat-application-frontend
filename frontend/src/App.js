import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import  Profile  from './components/Profile'
import Home from './components/Home';
import MakeFriend from './components/MakeFriend';
import Chat from './components/Chat';
import Faltu from './components/Faltu'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/login' element = {<LoginPage></LoginPage>}></Route>
        <Route path='/profile' element = {<Profile></Profile>}></Route>
        <Route path='/xxx' element = {<Faltu></Faltu>}></Route>
        <Route path='/profile/:userId' element = {<Chat></Chat>}></Route>
        <Route path='/profile/makefriend' element = {<MakeFriend></MakeFriend>}></Route>
        <Route path='/' element = {<Home></Home>}></Route>
      </Routes>
    </Router>
    
  );
}

export default App;
