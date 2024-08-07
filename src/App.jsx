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
import Settings from './Settings';
import Badges from './Badges';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Temp from './Temp';
import SiteBuilder from './SiteBuilder';
import LeaderboardPage from './leaderboard';
import Intergraion from './Integration';
import NotificationsPage from './notifications';
import { Provider } from 'react-redux';
//import store from './components/idesrc/store';
import Placements from './Placements.jsx'
import CodeEditor from './components/codeEditor/CodeEditor';
import Dashboard from './dashboard';
import QuizPage from './quiz';
const App = () => {
  return (
    <Router> 
      <Routes>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/Home' element={<HomePage/>}></Route>
        <Route path='/' element={<LandingPage/>}></Route>
        <Route path='/Profile/:id' element={<ProfilePage/>}></Route>
        <Route path='/settings/:id' element={<Settings/>}></Route>
        <Route path='/problem/:id' element={<ProblemPage/>}></Route> 
        <Route path='/quiz/:id' element={<QuizPage/>}></Route> 
        <Route path='/openLab' element={<YourComponent/>}></Route>
        <Route path= '/temp' element={<Temp/>}></Route>
        <Route path= '/badges' element={<Badges/>}></Route>
        <Route path= '/leaderboard' element={<LeaderboardPage/>}></Route>
        <Route path= '/adminConfig' element={<SiteBuilder/>}></Route>
        <Route path= '/integration' element={<Intergraion/>}></Route>
        <Route path= '/ide-simulator' element={<CodeEditor/>}></Route>
        <Route path= '/notifications' element={<NotificationsPage/>}></Route>
        <Route path= '/Placements' element={<Placements/>}></Route>
        <Route path= '/dashboard' element={<Dashboard/>}></Route>
      </Routes>
    </Router>

  )
}

export default App;
