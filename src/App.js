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

export default function App() {

  return (
    <>
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
