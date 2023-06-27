import Box from '@mui/material/Box'
import LoginPage from './pages/Login/LoginPage'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register/Register'
import MainPage from './pages/Main/MainPage'
import { Transaction } from 'pages/Transaction/Transaction'
import Profile from './pages/Profile/Profile'
import { Ratio } from './pages/Ratio/Ratio'
import { Forum } from './pages/Forum/Forum'

import axios from 'axios';
import constants from './constants/constants'
import { ToastContainer } from 'react-toastify'

export default function App() {

  if (localStorage.getItem('username') === null) {
    axios.get(`${constants.baseURL}/api/user`,
      { withCredentials: true }).then(response => {
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('displayName', response.data.displayName)
        localStorage.setItem('createdAt', response.data.createdAt)
        
        if (response.status === 200)
            window.location = '/main';
    }).catch(error => {
        console.log(error);
    });
  }

  return (
    <>
      <ToastContainer />
      <Box sx={{ flexGrow: 1 }} style={{ height: '100%', width: '100%' }}>
        <Navbar />
        <Routes>
          {localStorage.getItem('username') ?
            <>
              <Route path='/main' element={<MainPage />} />
              <Route path='/transaction' element={<Transaction />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/ratio' element={<Ratio />} />
              <Route path='/forum' element={<Forum />} />
            </>
            : null}
          <Route index element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Box>
    </>
  )
}
