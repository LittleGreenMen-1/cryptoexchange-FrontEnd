import React, { useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify'

import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './mainpage.css'
import { DrawerBar } from '../../components/Drawer/DrawerBar'
import { DataGridCrypto } from '../../components/DataGrid/DataGridCrypto'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DialogBox from '../../components/DialogBox/DialogBox'

import axios from 'axios';
import constants from '../../constants/constants'

const columnsBuy = [
    { field: '_id', hide: true },
    { field: 'name', headerName: 'Name', width: 300 },
    {
        field: 'ratio',
        headerName: 'Price ($)',
        width: 300,
    },
    {
        field: 'exchangeAmount',
        headerName: 'Available In Exchange',
        width: 550,
    },
];

const columnsSell = [
    { field: '_id', hide: true },
    { field: 'name', headerName: 'Name', width: 300 },
    {
        field: 'price',
        headerName: 'Price ($)',
        width: 300,
    },
    {
        field: 'amount',
        headerName: 'Available in Wallet',
        width: 550,
    },
];

const actionColumnBuy = [
    {
        field: "action",
        headerName: "Action",
        width: 120,
        renderCell: (params) => {
            return (
                <DialogBox title='Buy' name={params.row.name} ratio={params.row.ratio}/>
            );
        },
    },
];

const actionColumnSell = [
    {
        field: "action",
        headerName: "Action",
        width: 120,
        renderCell: (params) => {
            return (
                <DialogBox title='Sell' name={params.row.name} ratio={params.row.ratio}/>
            );
        },
    },
];

const MainPage = () => {
    const [value, setValue] = useState('one');
    const [buy, setBuy] = useState(true);
    const [availableFunds, setAvailableFunds] = useState(-1);

    const [searchParams, setSearchParams] = useSearchParams();

    // This function fetches the available funds (total xUSD tokens) from the server
    function getAvailableFunds() {
        axios.get(
            `${constants.baseURL}/wallet/funds`,
            {
                withCredentials: true,
            }
        ).then((response) => {
            setAvailableFunds(response.data.amount);
        }).catch((error) => {
            console.log(error);
        });
    }
    
    // These are the parameters that are passed in the URL when the user is redirected from the payment gateway
    // If the status is 202, then the transaction was successful
    // If the status is 402, then the transaction failed
    //
    if (searchParams.get('status') === '202') {
        toast.success('Transaction successful!', 
            {
                toastId: 'transaction-successful',
            }
        );

        setSearchParams({});
        getAvailableFunds();
    }

    if (searchParams.get('status') === '402') {
        toast.error('Transaction failed!', 
            {
                toastId: 'transaction-failed',
            }
        );

        setSearchParams({});
        getAvailableFunds();
    }

    if (availableFunds === -1) { // If the available funds are not set, then we fetch them from the server
        setInterval(getAvailableFunds, 1000);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
        {/* <ToastContainer /> */}
            <Box className='container' sx={{
                marginTop: 10,
            }}>
                <Paper
                    elevation={8}
                    className="paper"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 4fr',
                        gridTemplateRows: '50px 600px',
                        gridTemplateAreas: `'drawer tabs'
                                            'drawer datagrid'
                                            'drawer fab'`,
                        justifyContent: 'center',
                    }}
                >
                    <DrawerBar notHome={false} />
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            gridArea: 'tabs',
                            gridColumnStart: 2,
                            gridColumnEnd: 3,
                            gridRow: '100px',
                            marginTop: 5,
                            marginLeft: 5,
                        }}
                    >
                        <Tab value="one" label="Buy" onClick={ () => setBuy(true) } />
                        <Tab value="two" label="Sell" onClick={ () => setBuy(false) } />
                        {
                            availableFunds !== -1 && 
                            <p>Available funds: {availableFunds}$</p>
                        }
                    </Tabs>
                    {buy ? <DataGridCrypto columns={columnsBuy} actionColumn={actionColumnBuy} url={'crypto'} /> : <DataGridCrypto columns={columnsSell} actionColumn={actionColumnSell} url={'crypto-sell'} />}
                    <DialogBox title='Deposit Funds' />
                </Paper>
            </Box>
        </>
    )
}

export default MainPage
