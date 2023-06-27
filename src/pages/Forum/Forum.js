import './forum.css'

import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { TextField } from '@mui/material'

import { DrawerBar } from '../../components/Drawer/DrawerBar'
import { Question } from '../../components/Question/Question'
import constants from 'constants/constants'

import axios from 'axios';

// The forum (Q&A) page. It displays a list of answered questions that were posted by users.
// Also, it allows users to post new questions for the developers to answer.
//
export const Forum = () => {
    const [questions, setQuestions] = useState([]);
    const questionRef = useRef();

    // Get all the answered questions from the database
    const getQuestions = () => {
        axios.get(
            `${constants.baseURL}/forum`,
            { 
                withCredentials: true
            },
        ).then((res) => {            
            setQuestions(res.data.returnData);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Add a new question to the database
    const postQuestion = () => {
        let question = questionRef.current.value;

        if (question.length === 0) {
            toast.error('Please enter a question');
            return;
        }

        axios.post(
            `${constants.baseURL}/forum`,
            {
                question: question,
            },
            {
                withCredentials: true
            },
        ).then((res) => {
            toast.success('Question posted');

            questionRef.current.value = '';
        }).catch((err) => {
            console.log(err);
            toast.error('Failed to post question');

            questionRef.current.value = '';
        });

        getQuestions();
    }

    getQuestions();

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
                    <Box sx={{ gridArea: 'drawer' }}>
                        <DrawerBar notHome={true} />
                    </Box>

                    <>
                        <div className="App">
                            <div>
                                <List style={{maxHeight: '500px', overflow: 'auto'}} >
                                    { questions.map( (item) => (<Question question={ item.question } answer={ item.answer }/>) ) }
                                </List>
                            </div>
                            
                            <div class="row">
                                <TextField
                                    id="outlined-basic"
                                    label="What's on your mind?"
                                    variant="outlined"
                                    inputRef={questionRef} />
                                <Button 
                                    style={{maxHeight: '50px'}} 
                                    variant="outlined" 
                                    onClick={ postQuestion }>Ask</Button>
                            </div>
                        </div>
                    </>
                </Paper>
            </Box>
    )
}
