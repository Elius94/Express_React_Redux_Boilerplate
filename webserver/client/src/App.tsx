import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './routes/Login';
import Dashboard from './routes/Dashboard';
import { StartSocketConnection } from "./BkConnect"
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectGuest, setGuest, setPermissions, setUsername } from './features/app/appSlice';

//console.log("Backend IPv4 Addr:", process.env.REACT_APP_BK_IPV4_ADDRESS);

function App() {
  const dispatch = useDispatch()
  // Ottengo i dati registrati sui cookies
  const [session_key] = useState(
    localStorage.getItem('session_key') || ''
  );
  const [isUserAutenticated] = useState(
    localStorage.getItem('isUserAutenticated') || ''
  );
  const [username] = useState(
    localStorage.getItem('username') || ''
  );
  const [permissions] = useState(
    localStorage.getItem('permissions') || ''
  );
  const guest = useSelector(selectGuest);

  const loc = window.location.pathname

  useEffect(() => {
    let welcome_msg = '%c\n\n' +
      '  ██╗  ██╗██╗    ███████╗███████╗██╗     ██╗      █████╗ ███████╗██╗\n' +
      '  ██║  ██║██║    ██╔════╝██╔════╝██║     ██║     ██╔══██╗██╔════╝██║\n' +
      '  ███████║██║    █████╗  █████╗  ██║     ██║     ███████║███████╗██║\n' +
      '  ██╔══██║██║    ██╔══╝  ██╔══╝  ██║     ██║     ██╔══██║╚════██║╚═╝\n' +
      '  ██║  ██║██║    ██║     ███████╗███████╗███████╗██║  ██║███████║██╗\n' +
      '  ╚═╝  ╚═╝╚═╝    ╚═╝     ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝\n\n' +
      (isUserAutenticated === '' ? 'User have to log in!' : 'Logged in as ' + username + '\n')

    console.log(welcome_msg, 'font-family:monospace; color: #1976d2; font-size:12px;')
  });

  useEffect(() => {
    dispatch(setGuest(isUserAutenticated === 'true' ? false : true))// Salva su redux 
    dispatch(setUsername(username))// Salva su redux l'username
    if (permissions !== '') {
      const perm = JSON.parse(permissions)
      dispatch(setPermissions({
        users_management: perm.users_management,
        dataset_management: perm.dataset_management,
      }))
    }
    if (username !== '')
      StartSocketConnection(username, session_key)
  }, [username, session_key, isUserAutenticated, permissions]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={!guest ? <Dashboard />: <Login page={loc} />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
