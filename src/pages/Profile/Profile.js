import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './profile.css'
import { DrawerBar } from '../../components/Drawer/DrawerBar'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Textfield from '@mui/material/TextField'
import registerPhoto from '../../utils/img/RegisterPhoto.png'
import * as Yup from 'yup'
import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Profile = () => {
    const [page, setPage] = useState('one')
    const [confirmOldPass, setConfirmOldPass] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPass, setConfirmNewPass] = useState('')
    const [valid, setValid] = useState(false)
    const [file, setFile] = useState(null)
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
    }, [file])

    const handleSubmit = () =>{
        if( valid === false) return toast.error('Wrong input. Passwords must match')

        axios.post('http://localhost:1234/profile/change-password', 
        {
            confirmOldPass,
            newPassword
        },
        { withCredentials: true })
        .then(response => {
            toast.success(response.data.msg)
            setConfirmOldPass('')
            setNewPassword('')
            setConfirmNewPass('')
        })
        .catch(error => {
            toast.error(error.response.data.msg)
            console.log(error)
        })
    }

    const onFileChange = event => {
        setFile(event.target.files[0]) 
    }

    const handleFileSubmit = () => {
        if(file === null) return toast.error('Please upload a file')

        const formData = new FormData()
        formData.append('file', file)

        axios.put('http://localhost:1234/profile/avatar', formData,
            { withCredentials: true, headers: {
                "Content-type": "multipart/form-data"
            }})
            .then(response => {
                toast.success(response.data.msg)
                setFile(null)
            })
            .catch(error => {
                toast.error(error.response.data.msg)
                console.log(error)
            })
    }

    const schema = Yup.object({
        confirmOldPass: Yup.string().required().min(2),
        newPassword: Yup.string().required().min(2),
        confirmNewPass: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    })
    
    schema.isValid({
        confirmOldPass,
        confirmNewPass,
        newPassword
    })
    .then(valid => {
        setValid(valid)
    })

    return (
            <Box className='container' sx={{
                marginTop: 10,
            }}>
                <Paper
                    elevation={8}
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 4fr',
                        gridTemplateRows: '50px 700px',
                        gridTemplateAreas: `'drawer tabs'
                                            'drawer datagrid'`,
                    }}
                >
                    <Box sx={{
                        gridArea: 'drawer',
                    }}>
                        <DrawerBar notHome={true} />
                    </Box>
                    <Tabs
                        value={page}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            gridArea: 'tabs',
                            gridColumnStart: 2,
                            gridColumnEnd: 3,
                            gridRow: '100px',
                            marginTop: 5,
                        }}
                    >
                        <Tab value="one" label="Password" onClick={() => setPage('one')} />
                        <Tab value="two" label="Avatar" onClick={() => setPage('two')} />
                        
                    </Tabs>
                    {
                        page === 'one' ? (
                            <div className='mainContainer'>
                                <div className='fieldsContainer'>
                                    <div className='textfield'>
                                        <Textfield variant='outlined' size='small' fullWidth label="Current password" type='password' value={confirmOldPass} onChange={event => {setConfirmOldPass(event.target.value)}}/>
                                    </div>
                                    <div className='textfield'>
                                        <Textfield variant='outlined' size='small' fullWidth label="New password" type='password' value={newPassword} onChange={event => {setNewPassword(event.target.value)}}/>
                                    </div>
                                    <div className='textfield'>
                                        <Textfield variant='outlined' size='small' fullWidth label="Confirm new password" type='password' value={confirmNewPass} onChange={event => {setConfirmNewPass(event.target.value)}}/>
                                    </div>
                                    <div className='submitButton'>
                                        <Button variant="contained" onClick={handleSubmit}> Submit </Button>
                                    </div>
                                </div>
                                <img className="flexRight"
                                    src={registerPhoto}
                                    alt="Register Logo">
                                </img>  
                            </div>
                        )
                        : 
                        <div>
                            <form className='inputFile' encType="multipart/form">
                                <input type="file" name='file' onChange={onFileChange} />
                            </form>
                            <div className='submitButton'>
                                <Button variant="contained" onClick={handleFileSubmit} size='small'> Submit </Button>
                            </div>
                            <div className="imageContainer">
                                <img src={image} alt="Profile" className='profile-image'></img>
                            </div>
                        </div>
                    }
                </Paper>
            </Box>
    )
}

export default Profile
