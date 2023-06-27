import React, {useEffect, useState} from 'react'
import { Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import MovingIcon from '@mui/icons-material/Moving';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box } from '@mui/system';
import { Link } from 'react-router-dom';
import axios from 'axios'
import constants from 'constants/constants';
import HomeIcon from '@mui/icons-material/Home';

export const DrawerBar = ({ notHome }) => {

    const [image, setImage] = useState(null)

    useEffect(() => {
        axios.get('http://localhost:1234/profile/avatar', { withCredentials: true, 
        headers: {
            'Content-Type': 'image/jpeg'
        },
        responseType: 'blob'
    })
        .then(response =>{
            setImage(URL.createObjectURL(response.data))
        })
    })

    const logout = () => {
        localStorage.clear()
        axios.get(`${constants.baseURL}/logout`, { withCredentials: true })
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
    }

    return (
        <Drawer variant="permanent"
            sx={{
                gridArea: 'drawer',
                '& .MuiDrawer-paper': {
                    position: 'relative',
                },
                marginTop: 5,
            }}
            open
        >
            <Box sx={{
                display: 'grid',
                gridTemplateAreas: `'avatar'
                                    'name'
                                    'date'
                                    'list'
                                    'logout'`,
                gridTemplateRows: '120px 30px 20px 300px auto',
                justifyItems: 'center',
            }}>
                <Avatar
                    alt='user profile picture'
                    src={image}
                    sx={{
                        marginTop: 2,
                        width: 100,
                        height: 100,
                        gridArea: 'avatar',
                    }}
                />
                <Typography variant='h4' sx={{
                    gridArea: 'name',
                    fontSize: 20,
                }}>{localStorage.getItem('displayName')}</Typography>
                <Typography
                    sx={{
                        gridArea: 'date',
                        fontSize: 14,
                        color: 'rgba(0, 0, 0, 0.38)',
                    }}>Joined {localStorage.getItem('createdAt').substring(8, 10)}/{localStorage.getItem('createdAt').substring(5, 7)}/{localStorage.getItem('createdAt').substring(0, 4)}</Typography>
                <List sx={{
                    gridArea: 'list',
                }}>
                    {notHome ?
                        <ListItem disablePadding component={Link} to='/main' style={{ textDecoration: 'none', color: 'black' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary='Home' />
                            </ListItemButton>
                        </ListItem>
                        : null
                    }
                    <ListItem disablePadding component={Link} to='/transaction' style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <MovingIcon />
                            </ListItemIcon>
                            <ListItemText primary='Transaction History' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding component={Link} to='/ratio' style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <TimelineIcon />
                            </ListItemIcon>
                            <ListItemText primary='Currency ratio history' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding component={Link} to='/profile' style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText primary='Profile' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding component={Link} to='/forum' style={{ textDecoration: 'none', color: 'black' }}>
                        <ListItemButton>
                            <ListItemIcon>
                                <QuestionAnswerIcon />
                            </ListItemIcon>
                            <ListItemText primary='Forum' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Button
                    type='button'
                    variant='contained'
                    size='large'
                    onClick={logout}
                    sx={{
                        width: 220,
                        gridArea: 'logout',
                        marginTop: 18,
                    }}
                    href='http://localhost:1234/logout'
                >
                    Log out
                </Button>
            </Box>
        </Drawer >
    )
}
