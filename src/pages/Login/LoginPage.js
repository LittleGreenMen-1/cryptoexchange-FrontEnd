import React, { useState } from 'react'
import './loginPage.css'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik'
import * as Yup from 'yup'
import constants from '../../constants/constants'
import Alert from '@mui/material/Alert';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';


const LoginPage = () => {
    const [error, setError] = useState(false)
    const [closed, setClosed] = React.useState(false);

    const handleLoginClick = () => {
        axios.post(`${constants.baseURL}/auth/login`, {
            username: formik.values.username,
            password: formik.values.password
        }, { withCredentials: true }).then(response => {
            localStorage.setItem('username', response.data.username)
            localStorage.setItem('displayName', response.data.displayName)
            localStorage.setItem('createdAt', response.data.createdAt)
            if (response.status === 200) {
                window.location = '/main';
            }
        }).catch(error => {
            setError(true)
            setClosed(false)
            console.log(error);
        })
    }

    const handleGithubLogin = () => {
        window.location.href = `${constants.baseURL}/auth/github`;
    }

    const handleGoogleLogin = () => {
        window.location.href = `${constants.baseURL}/auth/google`;
    }

    const LoginSchema = Yup.object({
        username: Yup.string()
            .min(3, 'Too short')
            .max(50, 'Too long')
            .required('Username is empty'),
        password: Yup.string()
            .min(2, 'Too short')
            .max(50, 'Too long')
            .required('Required'),
    })

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: (values) => {
        }
    });



    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
                m: 15,
                width: '25%',
                height: '65vh',
            },
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper elevation={8}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    // gap: '50px',
                    marginY: '50px',
                    '& > :not(style)': {
                        // height: 30
                    }
                }}>
                    {error ?
                        <Collapse in={!closed}>
                            <Alert severity='error' variant='filled'
                                action={
                                    <IconButton
                                        aria-label="close"
                                        color="inherit"
                                        size="small"
                                        onClick={() => {
                                            setClosed(true);
                                        }}
                                    >
                                        <CloseIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mb: 2, width: '100%', }}
                            >
                                Login failed!
                            </Alert>
                        </Collapse>
                        : null
                    }
                    <Typography className='loginText' variant='h3'>Login</Typography>
                    <form className='form' autoComplete='off' onSubmit={formik.handleSubmit}>
                        <TextField
                            className='username'
                            size='small'
                            name='username'
                            label="Username"
                            variant="outlined"
                            value={formik.values.username}
                            onChange={formik.handleChange}
                            error={formik.values.username && Boolean(formik.errors.username)}
                            helperText={formik.values.username && formik.errors.username}
                            sx={{
                                marginTop: 2,
                            }}
                        />
                        <TextField
                            className='password'
                            size='small'
                            type='password'
                            name='password'
                            label="Password"
                            variant="outlined"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.values.password && Boolean(formik.errors.password)}
                            helperText={formik.values.password && formik.errors.password}
                            sx={{
                                marginTop: 1,
                            }}
                        />
                        <Button
                            className='button'
                            color="primary"
                            variant="contained"
                            type="submit"
                            fullWidth
                            size='large'
                            onClick={handleLoginClick}
                            sx={{
                                marginTop: 1,
                            }}
                        >
                            Login
                        </Button>
                    </form>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 3,
                    }}>
                        <span className='left' />
                        <small className='or'>Or</small>
                        <span className='right' />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        py: 2
                    }}>
                        <Button
                            className='gitButton'
                            color="secondary"
                            fullWidth
                            size='large'
                            variant="contained"
                            type="submit"
                            onClick={handleGithubLogin}
                            sx={{
                                marginTop: 1,
                            }}
                        >
                            Login with Github
                        </Button>

                        <Button
                            className='googleButton'
                            color="secondary"
                            fullWidth
                            size='large'
                            variant="contained"
                            type="submit"
                            onClick={handleGoogleLogin}
                            sx={{
                                marginTop: 2,
                            }}
                        >
                            Login with Google
                        </Button>
                    </Box>
                    <Typography variant='h7'>Don't Have An Account? Register <Link to='/register' className='link'>Here</Link></Typography>
                </Box>
            </Paper>
        </Box >
    )
}

export default LoginPage
