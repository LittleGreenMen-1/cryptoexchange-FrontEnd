import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import './navbar.css'

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          sx={{
            position: 'absolute',
            left: 100,
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Crypto Exchange
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
