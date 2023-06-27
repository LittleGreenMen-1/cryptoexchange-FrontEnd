import { Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DrawerBar } from 'components/Drawer/DrawerBar';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import constants from 'constants/constants'
import './ratio.css'

export const Ratio = () => {
    const [currency, setCurrency] = React.useState('');
    const [historyData, setHistoryData] = React.useState([]);
    const [limits, setLimits] = React.useState([0, 0]); // [min, max] - limits of the graph's y-axis

    const handleChange = (event) => {
        setCurrency(event.target.value);

        // Get history data from last year
        axios.get(
            `${constants.baseURL}/ratio-history?id=${event.target.value}`,
            {
                withCredentials: true
            }
        ).then((res) => {
            setHistoryData(res.data.data);
            setLimits(
                [res.data.min, res.data.max]
            );
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <>
            <Box className='container' sx={{
                marginTop: 10,
            }}>
                <Paper
                    elevation={8}
                    className="paper"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 4fr',
                        gridTemplateRows: '0.5fr 1fr 3fr',
                        gridTemplateAreas: `'drawer .'
                                            'drawer select'
                                            'drawer charts'`,
                        justifyContent: 'center',
                        width: '90%',
                        paddingBottom: 1,
                    }}
                >
                    <DrawerBar notHome={true} />
                    <Box sx={{ maxWidth: 200, gridArea: 'select' }}>
                        <Typography sx={{marginBottom: 2,}}>Currency ratio history</Typography>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Crypto</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currency}
                                label="Crypto"
                                onChange={handleChange}
                            >
                                <MenuItem value={'1'}>Bitcoin</MenuItem>
                                <MenuItem value={'1027'}>Ethereum</MenuItem>
                                <MenuItem value={'825'}>Tether</MenuItem>
                                <MenuItem value={'1839'}>Binance Coin</MenuItem>
                                <MenuItem value={'52'}>XRP</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <LineChart width={1000} height={500} data={historyData} className='charts'>
                        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" interval={30}/>
                        <YAxis domain={limits}/>
                    </LineChart>
                </Paper>
            </Box>
        </>
    )
}
