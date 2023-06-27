import { Box, Paper } from '@mui/material'
import { DataGridCrypto } from 'components/DataGrid/DataGridCrypto'
import { DrawerBar } from 'components/Drawer/DrawerBar'
import React from 'react'

const columnsTransaction = [
    { field: '_id', hide: true, },
    {
        field: 'sold',
        headerName: 'Sold',
        width: 300,
    },
    {
        field: 'bought',
        headerName: 'Bought',
        width: 300,
    },
    {
        field: 'cryptoInWallet',
        headerName: 'Crypto in Wallet',
        width: 200,
    },
    {
        field: 'currencyInWallet',
        headerName: 'Currency in Wallet',
        width: 150,
    },
    {
        field: 'transactionDate',
        headerName: 'Date',
        width: 200,
    },
];

export const Transaction = () => {
    return (
        <Box sx={{
            marginTop: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper
                elevation={8}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 4fr',
                    gridTemplateAreas: `'drawer datagrid'`,
                    paddingBottom: 3,
                }}
            >
                <DrawerBar notHome={true} />
                <DataGridCrypto columns={columnsTransaction} url={'transaction-history'} />
            </Paper>
        </Box>
    )
}
