import React from 'react';
import LandingPage from './LandingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Signup  from './Signup';
import  Login from './Login';
import HomePage from './Home';
import ProfilePage from './Profile';
import ProblemPage from  "./Problem";
import YourComponent from "./openLab";
import AddChallenge from './addChallenge';
import AddTopic from './addTopic';
import EditChallenge from './editChallenge';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Temp from './Temp'
const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/Home' element={<HomePage/>}></Route>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/Profile/:id' element={<ProfilePage/>}></Route>
        <Route path='/problem/:id' element={<ProblemPage/>}></Route> 
        <Route path='/openLab' element={<YourComponent/>}></Route>
        <Route path= '/addChallenge' element={<AddChallenge/>}></Route>
        <Route path= '/addTopic' element={<AddTopic/>}></Route>
        <Route path= '/editChallenge/:id' element={<EditChallenge/>}></Route>
        <Route path= '/temp' element={<Temp/>}></Route>
      </Routes>
    </Router>
  )
}

export default App;
