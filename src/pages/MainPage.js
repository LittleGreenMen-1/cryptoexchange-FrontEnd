import React from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './mainpage.css'
import { DrawerBar } from '../components/DrawerBar'

const MainPage = () => {
    

    return (
        <>
            <Box className='container' sx={{
                marginTop: 15,
            }}>
                <Paper
                    elevation={8}
                    sx={{
                        
                    }}
                >
                    <DrawerBar />
                </Paper>
            </Box>
        </>
    )
}

export default MainPage